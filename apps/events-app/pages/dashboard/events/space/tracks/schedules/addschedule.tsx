import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import DetailsBar from "@/components/detailsbar";


import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import FormTitle from '@/components/ui/labels/form-title';
import InputFieldDark from '@/components/ui/inputFieldDark';
import { EventSpaceDetailsType, InputFieldType, LocationUpdateRequestBody, TrackUpdateRequestBody } from '@/types';
import TextEditor from '@/components/ui/TextEditor';
import { Label } from '@/components/ui/label';
import SwitchButton from '@/components/ui/buttons/SwitchButton';
import { GoXCircle } from 'react-icons/go';
import InputFieldLabel from '@/components/ui/labels/inputFieldLabel';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import CustomDatePicker from '@/components/ui/DatePicker';
import { useRouter } from 'next/router';
import { fetchLocationsByEventSpace, createSchedule, fetchAllTags, fetchAllSpeakers } from '@/controllers';
import { useQuery, useMutation } from 'react-query';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import fetchTracksByEventSpaceId from '@/services/fetchTracksByEventSpace';
// import timepicker as Timepicker from "react-time-picker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { Loader } from "@/components/ui/Loader";
import { toast } from "@/components/ui/use-toast";

type Organizer = {
  name: string;
  role: string;
};

type TagItemProp = {
  name: string;
};

export default function AddSchedulePage(props: any) {
  // console.log(props, "page props");

  const optionTags = props.tags;
  const optionSpeakers = props.organizers;
  const defaultProps = {
    options: optionTags,
    getOptionLabel: (option: { name: string }) => option.name,
  };

  const savedLocations = props.savedLocations;

  const [locationId, setLocationId] = useState(
    savedLocations.length > 0 ? savedLocations[0].id : ""
  );
  const router = useRouter();
  const { query } = useRouter();
  const { event_space_id, trackId, track_title } = router.query;
  const [selectedEventFormat, setSelectedEventFormat] = useState('');
  const [switchDialogue, setSwitchDialogue] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [rsvpAmount, setRsvpAmount] = useState(1);
  const [organizers, setOrganizers] = useState<any>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagItem, setTagItem] = useState<TagItemProp>({ name: '' });
  const [eventItem, setEventItem] = useState({ name: '', role: 'speaker' });
  const [frequency, setFrequency] = useState<string>('');

  console.log(eventItem, organizers);
  // const [savedLocations, setSavedLocations] = useState<
  //   LocationUpdateRequestBody[]
  // >([]);
  // const [locationId, setLocationId] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const handleChangeSwitch = () => {
    setIsAllDay((prev) => !prev);
  };
  const [startTime, setStartTime] = useState(dayjs("2023-11-17T00:00"));
  const [endTime, setEndTime] = useState(dayjs("2023-11-17T23:59"));
  const [isLimit, setIsLimit] = useState(false);
  const [scheduleAdded, setScheduleAdded] = useState(false);
  const isQuickAccess = query.quickAccess === 'true';
  const [selectedTrackId, setSelectedTrackId] = useState('');

  const { data: trackDetails } = useQuery<TrackUpdateRequestBody[], Error>(['trackDetails', event_space_id], () => fetchTracksByEventSpaceId(event_space_id as string), {
    enabled: !!event_space_id,
    onSuccess: (data) => {
      console.log('tracks', data);
    },
  });
  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    ['currentEventSpace', event_space_id], // Query key
    () => fetchEventSpaceById(event_space_id as string), // Query function
    {
      enabled: !!event_space_id, // Only execute the query if event_space_id is available
    }
  );

  console.log("EventSpace", eventSpace);

  const [eventType, setEventType] = useState("");

  const handleLimitRSVP = () => {
    setIsLimit((prev) => !prev);
  };

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Schedule name is required.",
    }),
    format: z
      .enum(["in-person", "online", "hybrid"], {
        required_error: "You need to select a format.",
      })
      .default(() => eventSpace?.format ?? "in-person"),
    date: z
      .date({
        required_error: "You need to select a valid date for this schedule.",
        invalid_type_error:
          "You need to select a valid date for this schedule.",
      })
      .refine(
        (date) => {
          if (date) {
            const today = dayjs();
            const selectedDate = dayjs(date);
            return selectedDate.isAfter(today);
          }
          return false;
        },
        {
          message: "You cannot create a schedule in the past.",
        }
      ),
    description: z.string().min(10, {
      message:
        "Description is required and should be a minimum of 10 characters",
    }),
    video_call_link: z.string().optional().or(z.literal("")),
    live_stream_url: z.string().optional().or(z.literal("")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      format: eventSpace?.format,
      date: undefined,
      description: "",
      video_call_link: "",
      live_stream_url: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      values.format !== "in-person" &&
      (!values.video_call_link || values.video_call_link === "")
    ) {
      form.setError("video_call_link", {
        message: "Video call link is required for online or hybrid events",
      });
      return;
    }
    if (
      values.format !== "in-person" &&
      (!values.live_stream_url || values.live_stream_url === "")
    ) {
      form.setError("live_stream_url", {
        message: "Live stream link is required for in-person or hybrid events",
      });
      return;
    }
    if (values.format === "in-person" && locationId === "") {
      toast({
        title: "Error",
        description: "Location is required for in-person events",
        variant: "destructive",
      });
      return;
    }
    const additionalPayload = {
      event_space_id: event_space_id as string,
      start_time: startTime as unknown as Date,
      end_time: endTime as unknown as Date,
      event_type:
        eventType.length > 0
          ? [eventType]
          : eventSpace?.event_type?.[0]
            ? [eventSpace?.event_type[0]]
            : [eventSpace?.event_type || "Meetup"],
      experience_level:
        experienceLevel.length > 0
          ? [experienceLevel]
          : eventSpace?.experience_level?.[0]
            ? [eventSpace?.experience_level[0]]
            : [eventSpace?.experience_level || "Beginner"],
      tags: tags,
      schedule_frequency: frequency,
      location_id:
        locationId === "" ? "403a376c-7ac7-4460-b15d-6cc5eabf5e6c" : locationId,
      organizers,
      all_day: isAllDay,
      limit_rsvp: isLimit,
      ...(eventSpace?.event_space_type === "tracks" && {
        track_id: selectedTrackId ? selectedTrackId : (trackId as string),
      }),
      ...(isLimit ? { rsvp_amount: rsvpAmount } : {}),
      // isLimit && rsvp_amount: rsvpAmount
    };
    const payload = {
      ...values,
      ...additionalPayload,
      video_call_link:
        values.video_call_link === ""
          ? "https://youtube.com"
          : values.video_call_link,
      live_stream_url:
        values.live_stream_url === ""
          ? "https://youtube.com"
          : values.live_stream_url,
    };
    console.log(payload, "payload");
    try {
      const result = await createSchedule(payload as any, event_space_id as string);
      setSwitchDialogue(true);
      setScheduleAdded(true);
      console.log(result, "result");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response.data?.error,
        variant: "destructive",
      });
    }
  }

  const handleEventFormatChange = (e: string) => {
    setSelectedEventFormat(e);
    // setEventFormat(selectedEventFormat);
  };

  const handleRemoveOrganizer = (index: number) => {
    const updatedItems = [
      ...organizers.slice(0, index),
      ...organizers.slice(index + 1),
    ];
    setOrganizers(updatedItems);
  };

  const handleRemoveTag = (index: number) => {
    const updatedItems = [...tags.slice(0, index), ...tags.slice(index + 1)];
    setTags(updatedItems);
  };

  const handleEnterTrack = async () => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules`,
        query: {
          event_space_id: event_space_id,
          track_title: track_title,
          trackId: isQuickAccess ? selectedTrackId : trackId,
        },
      });
    } catch (error) {
      console.error("Error fetching space details", error);
    }
  };

  useEffect(() => {
    console.log(form.formState.errors);
    //get the first item from the errors object
    const firstError = Object.values(form.formState.errors)[0];
    if (firstError) {
      toast({
        title: "Error",
        description: firstError?.message,
        variant: "destructive",
      });
    }
  }, [form.formState.errors]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex items-start gap-[60px] self-stretch px-10 py-5">
      <DetailsBar />
      <div className="flex flex-col items-start gap-[17px] flex-1">
        <div className="flex items-center gap-[17px] self-stretch">
          <Button
            className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
            size="lg"
            leftIcon={HiArrowLeft}
            onClick={() => router.back()}
          >
            Back
          </Button>
          <div className="flex flex-col gap-[10px]">
            <span className="text-2xl items-start font-bold">{track_title}</span>
            <span className="text-sm opacity-70">You are adding a schedule for this track</span>
          </div>
        </div>
        <div className="flex py-5 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-[#FFFFFF10] bg-[#2E3131]">
          <div className="flex flex-col items-center gap-[34px] self-stretch w-full">
            <div className="flex flex-col py-5 px-10 items-center gap-[10px] self-stretch w-full">
              <FormTitle name="Add a Schedule" />
              {scheduleAdded ? (
                <div className="flex flex-col items-center">
                  <h3 className="font-bold text-xl">
                    Your Schedule Has Been Added
                  </h3>

                  <Button
                    onClick={handleEnterTrack}
                    variant="primary"
                    className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full"
                    leftIcon={HiArrowRight}
                  >
                    Go to schedules
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 w-full">
                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-2xl opacity-80 leading-[1.2]">
                            Schedule Format
                          </FormLabel>
                          <FormDescription>
                            The format has been inherited from the event space.
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={eventSpace?.format}
                              className="flex flex-col md:flex-row justify-between"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 hover:bg-btnPrimaryGreen/20 rounded-md focus:bg-btnPrimaryGreen/20">
                                <FormControl>
                                  <RadioGroupItem value="in-person" />
                                </FormControl>
                                <FormLabel className="font-semibold text-white/60 text-base">
                                  In-Person
                                  <span className="text-xs block">
                                    This is a physical event
                                  </span>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 hover:bg-btnPrimaryGreen/20 rounded-md">
                                <FormControl>
                                  <RadioGroupItem value="online" />
                                </FormControl>
                                <FormLabel className="font-semibold text-white/60 text-base ">
                                  Online
                                  <span className="text-xs block">
                                    Specifically Online Event
                                  </span>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0 p-3 hover:bg-btnPrimaryGreen/20 rounded-md">
                                <FormControl>
                                  <RadioGroupItem value="hybrid" />
                                </FormControl>
                                <FormLabel className="font-semibold text-white/60 text-base">
                                  Hybrid
                                  <span className="text-xs block">
                                    In-Person & Online
                                  </span>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                            Schedule Name{" "}
                          </FormLabel>
                          <FormControl>
                            <InputFieldDark
                              type={InputFieldType.Primary}
                              placeholder={"Enter a name for your event"}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isQuickAccess && (
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                          Select Track
                        </Label>
                      </div>
                    )}
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="flex flex-col gap-[10px]">
                                <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                  Schedule Description
                                </h2>
                                <TextEditor
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-full">
                      <h2 className="text-xl opacity-70 self-stretch">
                        Schedule Date & Times
                      </h2>
                      <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                        <div className="flex gap-5">
                          <SwitchButton
                            value={isAllDay}
                            onClick={handleChangeSwitch}
                          />
                          <span className="text-lg opacity-70 self-stretch">
                            All Day
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-[30px] self-stretch w-full">
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                                <span className="text-lg opacity-70 self-stretch">
                                  Start Date
                                </span>

                                <CustomDatePicker
                                  defaultDate={undefined}
                                  selectedDate={field.value}
                                  handleDateChange={field.onChange}
                                  {...field}
                                />

                                <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">
                                  Click & Select or type in a date
                                </h3>
                                <FormMessage />
                              </div>
                            )}
                          />
                          {!isAllDay && (
                            <>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div className="flex justify-between gap-10 text-white">
                                  <TimePicker
                                    label="Start Time"
                                    value={startTime}
                                    className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                                    onChange={(newValue: any) =>
                                      setStartTime(newValue)
                                    }
                                    sx={{
                                      input: {
                                        color: "white",
                                      },
                                      label: {
                                        color: "white",
                                      },
                                      svg: {
                                        color: "white", // change the icon color
                                      },
                                      backgroundColor: "#242727",
                                      color: "white",
                                      borderRadius: "8px",
                                      width: "100%",
                                      // borderColor: "white",
                                      // borderWidth: "1px",
                                      border: "1px solid #1A1A1A",
                                    }}
                                  />
                                  <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                                    onChange={(newValue: any) =>
                                      setEndTime(newValue)
                                    }
                                    sx={{
                                      input: {
                                        color: "white",
                                      },
                                      label: {
                                        color: "white",
                                      },
                                      svg: {
                                        color: "white", // change the icon color
                                      },
                                      backgroundColor: "#242727",
                                      color: "white",
                                      borderRadius: "8px",
                                      width: "100%",
                                      // borderColor: "white",
                                      // borderWidth: "1px",
                                      border: "1px solid #1A1A1A",
                                    }}
                                  />
                                </div>
                              </LocalizationProvider>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                            Select a Timezone
                          </Label>
                          {/* <select
                            // onChange={(e) => setFrequency(e.target.value as any)}
                            className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                            title="frequency"
                          >
                            <option className="bg-componentPrimary origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" value="once">UTC</option>
                          </select> */}
                        </div>
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                            Select Schedule Frequency
                          </Label>
                        </div>
                        <line></line>
                      </div>
                    </div>
                    <div className="w-full">
                      <h2 className="text-xl opacity-70 self-stretch font-semibold">
                        Location
                      </h2>
                      <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                            Select Location
                          </Label>

                          <select
                            onChange={(e) => setLocationId(e.target.value)}
                            title="location"
                            value={locationId}
                            className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                          >
                            {savedLocations.length === 0 && (
                              <option value="">No saved locations</option>
                            )}
                            {savedLocations?.map((location: any) => (
                              <option key={location.id} value={location.id}>
                                {location.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <FormField
                            control={form.control}
                            name="video_call_link"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                  Video Call Link
                                </FormLabel>
                                <FormControl>
                                  <InputFieldDark
                                    type={InputFieldType.Link}
                                    placeholder={"Type URL"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <FormField
                            control={form.control}
                            name="live_stream_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                  Live Stream Link
                                </FormLabel>
                                <FormControl>
                                  <InputFieldDark
                                    type={InputFieldType.Link}
                                    placeholder={"Type URL"}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <line></line>
                    <div className="w-full">
                      <h2 className="text-xl opacity-70 self-stretch font-semibold pb-5">
                        Roles
                      </h2>
                      <div className="flex flex-col gap-6 items-start self-stretch">
                        <div className="flex flex-col gap-6">
                          <div className="flex items-end gap-6 self-stretch">
                            <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                              <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                Enter Name
                              </h2>
                              <InputFieldDark
                                type={InputFieldType.Primary}
                                value={eventItem.name}
                                onChange={(e) =>
                                  setEventItem({
                                    ...eventItem,
                                    name: (e.target as HTMLInputElement).value,
                                  })
                                }
                                placeholder={"Enter the name"}
                              />
                            </div>
                            <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                              <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                Select Role
                              </h2>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (eventItem.name === '') return;
                                setOrganizers([...organizers, eventItem]);
                                setEventItem({ name: "", role: "speaker" });
                              }}
                              className="flex gap-2.5 mb-2 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-white bg-opacity-10"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex gap-2.5">
                            {organizers?.map(
                              (organizer: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
                                >
                                  <button
                                    type="button"
                                    className="flex gap-2.5 items-center"
                                  >
                                    <GoXCircle
                                      onClick={() =>
                                        handleRemoveOrganizer(index)
                                      }
                                      className="top-0.5 left-0.5 w-4 h-4"
                                    />
                                    <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                      {organizer.name}
                                    </span>
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-6">
                      <h2 className="text-lg opacity-70 self-stretch font-bold pb-5">
                        Schedule Labels
                      </h2>
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                          Select Event Category
                        </Label>
                      </div>
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                          Select Experience Level
                        </Label>
                        {/* <InputFieldDark type={InputFieldType.Option} placeholder={'Beginner'} /> */}

                        <select
                          onChange={(e) => setExperienceLevel(e.target.value)}
                          value={experienceLevel}
                          title="category"
                          className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                        >
                          {eventSpace?.experience_level?.length === 0 ||
                            (eventSpace?.experience_level === null && (
                              <option value="">
                                No saved experience levels
                              </option>
                            ))}
                          {eventSpace?.experience_level?.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col items-start gap-6 self-stretch">
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                            Add Tags
                          </Label>
                          <div className="flex w-full text-white gap-5">
                            <Autocomplete
                              {...defaultProps}
                              id="controlled-demo"
                              sx={{ color: "white", width: "100%" }}
                              value={tagItem}
                              onChange={(event: any, newValue) => {
                                if (newValue) {
                                  setTagItem({ name: newValue.name });
                                }
                              }}
                              onInputChange={(event, newInputValue) => {
                                setTagItem({ name: newInputValue });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    color: "white",
                                    input: {
                                      color: "white",
                                    },
                                    label: {
                                      color: "white",
                                    },
                                  }}
                                  {...params}
                                  label="tags"
                                  variant="standard"
                                />
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (tagItem.name === "") return;
                                setTags([...tags, tagItem.name]);
                                setTagItem({ name: "" });
                              }}
                              className="flex gap-2.5 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-white bg-opacity-10"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex gap-2.5">
                            {tags?.map((tag, index) => (
                              <div
                                key={index}
                                className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
                              >
                                <button className="flex gap-2.5 items-center">
                                  <GoXCircle
                                    onClick={() => handleRemoveTag(index)}
                                    className="top-0.5 left-0.5 w-4 h-4"
                                  />
                                  <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                                    {tag}
                                  </span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <line />
                      </div>
                    </div>
                    <div className="w-full">
                      <span className="text-lg opacity-70 self-stretch">
                        Advanced
                      </span>
                      <div className="flex flex-col items-center gap-5 self-stretch">
                        <div className="flex items-center gap-5 self-stretch">
                          <SwitchButton
                            value={isLimit}
                            onClick={handleLimitRSVP}
                          />
                          <span className="flex-1 text-base font-semibold leading-[1.2]">
                            Limit RSVPs
                          </span>
                        </div>
                        {isLimit && (
                          <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                            <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                              Select an Amount
                            </Label>
                            <input
                              type="number"
                              className="bg-gray-600 w-full outline-none px-4 rounded-md py-2"
                              placeholder={"50"}
                              onChange={(e) =>
                                setRsvpAmount(
                                  e.target.value as unknown as number
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center pt-8">
                      <div className="flex gap-[30px] w-full">
                        <Button
                          className="rounded-full w-1/2 flex justify-center"
                          variant="quiet"
                          size="lg"
                          type="button"
                          leftIcon={CgClose}
                        >
                          <span>Discard Schedule</span>
                        </Button>
                        <Button
                          className="rounded-full w-1/2 flex justify-center"
                          variant="blue"
                          size="lg"
                          type="submit"
                          leftIcon={FaCircleArrowUp}
                        >
                          <span>Add Schedule</span>
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: null,
        user: null,
      },
    };

  // get profile from session
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("uuid", session.user.id);

  const locationsResult = await fetchLocationsByEventSpace(ctx.query.event_space_id);
  const tagsResult = await fetchAllTags();
  const organizersResult = await fetchAllSpeakers();

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
      savedLocations: locationsResult.data.data,
      tags: tagsResult.data.data,
      organizers: organizersResult.data.data,
    },
  };
};
