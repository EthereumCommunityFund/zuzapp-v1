import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import Button from "@/components/ui/buttons/Button";
import { HiArrowRight } from "react-icons/hi";

import { CgClose } from "react-icons/cg";
import { FaCircleArrowDown, FaCircleArrowUp } from "react-icons/fa6";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import FormTitle from "@/components/ui/labels/form-title";
import InputFieldDark from "@/components/ui/inputFieldDark";
import {
  EventSpaceDetailsType,
  InputFieldType,
  LocationUpdateRequestBody,
  ScheduleUpdateRequestBody,
} from "@/types";
import TextEditor from "@/components/ui/TextEditor";
import { Label } from "@/components/ui/label";
import SwitchButton from "@/components/ui/buttons/SwitchButton";
import { GoXCircle } from "react-icons/go";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import CustomDatePicker from "@/components/ui/DatePicker";
import { useRouter } from "next/router";
import {
  fetchLocationsByEventSpace,
  fetchAllTags,
  fetchScheduleByID,
  updateSchedule,
  createSchedule,
  fetchAllSpeakers,
} from "@/controllers";
import { useQuery } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "../ui/Loader";
import { Dialog } from "@radix-ui/react-dialog";

import { X } from "lucide-react";
import { sessionFrequency } from "@/constant/scheduleconstants";
import { fromTurkeyToUTC, toTurkeyTime } from "@/utils";

type Organizer = {
  name: string;
  role: string;
};

type TagItemProp = {
  name: string;
};

interface IAddScheduleForm {
  title: string;
  isQuickAccess: boolean;
  scheduleId?: string;
  trackId?: string;
  event_space_id: string;
  updateIsLoading?: (newState: boolean) => void;
}

export default function AddScheduleForm({
  title,
  isQuickAccess,
  scheduleId,
  trackId,
  event_space_id,
  updateIsLoading,
}: IAddScheduleForm) {
  const router = useRouter();

  const [isAllDay, setIsAllDay] = useState(false);

  const [schedule, setSchedule] = useState<ScheduleUpdateRequestBody>({
    name: "",
    format: "in-person",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    end_date: "",
    all_day: false,
    schedule_frequency: "once",
    images: [""],
    // video_call_link: '',
    live_stream_url: "",
    location_id: "",
    event_type: "",
    experience_level: "",
    limit_rsvp: false,
    rsvp_amount: 1,
    event_space_id: "",
    track_id: "",
    tags: [],
    organizers: [],
    current_rsvp_no: 0,
    editlogs: "",
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [optionTags, setOptionTags] = useState<TagItemProp[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagItem, setTagItem] = useState<TagItemProp>({ name: "" });
  const [eventItem, setEventItem] = useState({
    name: "",
    role: "speaker",
  });
  const [organizers, setOrganizers] = useState<any>([]);
  const [frequency, setFrequency] = useState<"once" | "everyday" | "weekly">(
    "once"
  );
  const [savedLocations, setSavedLocations] = useState<
    LocationUpdateRequestBody[]
  >([]);
  const [locationId, setLocationId] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [eventCategory, setEventCategory] = useState("");

  const [rsvpAmount, setRsvpAmount] = useState(1);
  const handleChangeSwitch = () => {
    setIsAllDay((prev) => !prev);
  };
  const [startTime, setStartTime] = useState(dayjs().startOf("day"));
  const [endTime, setEndTime] = useState(dayjs().endOf("day"));
  const [scheduleAdded, setScheduleAdded] = useState(false);
  const [isLimit, setIsLimit] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    trackId as string
  );
  const [optionalOrganizers, setOptionalOrganizers] = useState<any>([]);
  const [selectedEventFormat, setSelectedEventFormat] = useState<string>("new");

  const formSchema = z.object({
    name: z.string().min(2, {
      message: "Session name is required.",
    }),
    format: z.enum(["in-person", "online"], {
      required_error: "You need to select a format.",
    }),
    date: z
      .date({
        required_error: "You need to select a valid date for this Session.",
        invalid_type_error: "You need to select a valid date for this Session.",
      })
      .refine(
        (date) => {
          if (date) {
            console.log(date, `date`);
            const today = dayjs();
            const selectedDate = dayjs(date);
            return selectedDate.isAfter(today);
          }
          return false;
        },
        {
          message: "You need to select a valid date for this Session.",
        }
      ),
    end_date: z
      .date({
        required_error: "You need to select a valid date for this event.",
        invalid_type_error: "You need to select a valid date for this event.",
      })
      .optional(),
    description: z.string().min(40, {
      message: "Description is required and must be a minimum of 40 characters",
    }),
    video_call_link: z.string().optional().or(z.literal("")),
    live_stream_url: z.string().optional().or(z.literal("")),
  });

  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    ["currentEventSpace", event_space_id], // Query key
    () => fetchEventSpaceById(event_space_id as string), // Query function
    {
      enabled: !!event_space_id, // Only execute the query if event_space_id is available
    }
  );

  const [eventType, setEventType] = useState("");

  const handleLimitRSVP = () => {
    setSchedule({ ...schedule, limit_rsvp: !schedule.limit_rsvp });
    setIsLimit(!isLimit);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: schedule?.name,
      format: eventSpace?.format,
      date: undefined,
      end_date: undefined,
      description: "",
      video_call_link: "",
      live_stream_url: schedule?.live_stream_url,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      values.format !== "in-person" &&
      (!values.live_stream_url || values.live_stream_url === "")
    ) {
      form.setError("live_stream_url", {
        message: "Live stream link is required for online eevents",
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

    if (frequency === "everyday" || frequency === "weekly") {
      const endDate = fromTurkeyToUTC(values.end_date);
      const startDate = fromTurkeyToUTC(values.date);

      if (endDate.isBefore(startDate)) {
        form.setError("end_date", {
          message: "End date cannot be earlier than start date",
        });
        return;
      }
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
      date: fromTurkeyToUTC(values.date).toDate(),
      end_date: fromTurkeyToUTC(values.end_date).toDate(),
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
      setIsLoading(true);
      const result = await createSchedule(
        payload as any,
        event_space_id as string
      );
      setScheduleAdded(true);
      toast({
        title: "Schedule created successfully",
      });
      console.log(result, "result");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response.data?.error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  const onSubmitWithEnter = (values: z.infer<typeof formSchema>) => {
    return null;
  };

  const handleRemoveTag = (index: number) => {
    const updatedItems = [
      ...(schedule.tags as string[]).slice(0, index),
      ...(schedule.tags as string[]).slice(index + 1),
    ];
    console.log(updatedItems);
    setSchedule({ ...schedule, tags: updatedItems });
  };

  const handleRemoveOrganizer = (index: number) => {
    const updatedItems = [
      ...organizers.slice(0, index),
      ...organizers.slice(index + 1),
    ];
    const updatedScheduleItems = [
      ...(schedule.organizers as Organizer[]).slice(0, index),
      ...(schedule.organizers as Organizer[]).slice(index + 1),
    ];
    setOrganizers(updatedItems);
    setSchedule({ ...schedule, organizers: updatedScheduleItems as any });
  };

  const handleTrackSelect = (e: any) => {
    setSelectedTrackId(e.target.value);
    setSchedule({ ...schedule, track_id: e.target.value });
  };

  const handleFrequencySelect = (e: any) => {
    setFrequency(e.target.value);
    setSchedule({
      ...schedule,
      schedule_frequency: e.target.value as any,
    });
  };

  const handleEventFormatChange = (e: string) => {
    setSelectedEventFormat(e);
  };

  const defaultProps = {
    options: optionTags,
    getOptionLabel: (option: { name: string }) => option.name,
  };
  const defaultSpeakers = {
    options: optionalOrganizers,
    getOptionLabel: (option: { name: string }) => option.name,
  };

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        console.log("evnet space id", event_space_id);
        const result = await fetchLocationsByEventSpace(
          event_space_id as string
        );
        console.log(result);
        setSavedLocations(result?.data?.data);
        setLocationId(result.data.data[0].id);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTags = async () => {
      try {
        const result = await fetchAllTags();
        console.log(result);
        setOptionTags(result.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSpeakers = async () => {
      try {
        const result = await fetchAllSpeakers();
        setOptionalOrganizers(result.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCurrentSchedule = async () => {
      try {
        const result = await fetchScheduleByID(scheduleId as string);
        console.log("result.data", result.data.data);
        setSchedule({
          ...result.data.data,
          event_type: JSON.parse(result.data.data.event_type)[0],
          experience_level: JSON.parse(result.data.data.experience_level)[0],
        });
        setStartDate(toTurkeyTime(result.data.data.date).toDate());

        form.reset({
          name: result.data.data.name,
          format: result.data.data.format,
          date:
            schedule?.date !== ""
              ? toTurkeyTime(result.data.data.date).toDate()
              : new Date(),
          end_date:
            schedule.end_date !== undefined && schedule.end_date !== null
              ? toTurkeyTime(schedule.end_date).toDate()
              : new Date(),
          description: result.data.data.description,
          // video_call_link: result.data.data.video_call_link,
          live_stream_url: result.data.data.live_stream_url,
        });
        console.log(result.data.data.date);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentSchedule();
    fetchSpeakers();

    fetchLocationDetails();
    fetchTags();
  }, []);

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

  const handleEnterSchedules = () => {
    updateIsLoading && updateIsLoading(true);
    try {
      router.push({
        pathname: router.pathname.startsWith(`/dashboard/eventview/about`)
          ? `/dashboard/eventview/allschedules`
          : router.pathname,
        query: {
          event_space_id: event_space_id,
          trackId: trackId,
        },
      });
    } catch (error) {
      console.error("Error redirecting schedulelists", error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col items-center gap-[34px] self-stretch w-full text-white">
      <div className="flex flex-col py-5 items-center gap-[10px] self-stretch w-full">
        <div className="flex justify-between self-stretch">
          <FormTitle name="Add a Session" />
          <DialogPrimitive.Close>
            <Button size="sm" className="rounded-full w-10 h-10">
              <X />
            </Button>
          </DialogPrimitive.Close>
        </div>
        {scheduleAdded ? (
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-xl">Your Session Has Been Added</h3>
            <DialogPrimitive.Close>
              <Button
                onClick={handleEnterSchedules}
                variant="primary"
                className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full"
                leftIcon={HiArrowRight}
              >
                Go to Sessions
              </Button>
            </DialogPrimitive.Close>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitWithEnter)}
              className="space-y-10 w-full"
            >
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-2xl opacity-80">
                      Session Format
                    </FormLabel>
                    <FormDescription>
                      The format has been inherited from the event space.
                    </FormDescription>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => (
                          field.onChange(value), handleEventFormatChange(value)
                        )}
                        defaultValue={eventSpace?.format}
                        className="flex flex-col md:flex-row"
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
                      Session Name{" "}
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
                  <select
                    onChange={handleTrackSelect}
                    title="Track List"
                    value={selectedTrackId}
                    defaultValue={selectedTrackId}
                    className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                  >
                    <option value="">Select Track</option>
                    {eventSpace?.tracks.map((track: any) => (
                      <option key={track.id} value={track.id}>
                        {track.name}
                      </option>
                    ))}
                  </select>
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
                          <Label className="text-2xl opacity-80">
                            Session Description
                          </Label>
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
                <Label className="text-2xl opacity-80">
                  Session Date & Times
                </Label>
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
                  <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                    <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                      Select Session Frequency
                    </Label>
                    <select
                      onChange={handleFrequencySelect}
                      value={frequency}
                      className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                      title="frequency"
                    >
                      <option
                        className="bg-componentPrimary origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        value="once"
                      >
                        Once
                      </option>
                      <option
                        className="bg-componentPrimary origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        value="everyday"
                      >
                        Everyday
                      </option>
                      <option
                        className="bg-componentPrimary origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        value="weekly"
                      >
                        Weekly
                      </option>
                    </select>
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
                              value={toTurkeyTime(startTime)}
                              className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                              onChange={(newValue: any) => {
                                let _time = fromTurkeyToUTC(newValue);
                                setStartTime(_time);
                              }}
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
                              slotProps={{
                                popper: {
                                  sx: {
                                    pointerEvents: "auto",
                                  },
                                },
                              }}
                            />
                            <TimePicker
                              label="End Time"
                              value={toTurkeyTime(endTime)}
                              className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                              onChange={(newValue: any) => {
                                let _time = fromTurkeyToUTC(newValue);
                                setEndTime(_time);
                              }}
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
                              slotProps={{
                                popper: {
                                  sx: {
                                    pointerEvents: "auto",
                                  },
                                },
                              }}
                            />
                          </div>
                        </LocalizationProvider>
                      </>
                    )}
                  </div>

                  {(schedule?.schedule_frequency === sessionFrequency.WEEKLY ||
                    schedule?.schedule_frequency ===
                      sessionFrequency.EVERYDAY) && (
                    <div className="flex flex-col items-center gap-[30px] self-stretch w-full">
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                            <span className="text-lg opacity-70 self-stretch">
                              End Date
                            </span>

                            <CustomDatePicker
                              defaultDate={undefined}
                              selectedDate={field.value || null}
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
                    </div>
                  )}
                  <line></line>
                </div>
              </div>
              <div className="w-full">
                {selectedEventFormat === "new" &&
                  eventSpace?.format === "in-person" && (
                    <>
                      <h2 className="text-2xl opacity-80">Location</h2>
                      <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                            Select Location
                          </Label>
                          {/* <InputFieldDark type={InputFieldType.Option} placeholder={'The Dome'} /> */}
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
                    </>
                  )}
                {selectedEventFormat === "in-person" && (
                  <>
                    <h2 className="text-2xl opacity-80">Location</h2>
                    <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                          Select Location
                        </Label>
                        {/* <InputFieldDark type={InputFieldType.Option} placeholder={'The Dome'} /> */}
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
                  </>
                )}
                <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                  {/* <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                    <FormField
                      control={form.control}
                      name="video_call_link"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold leading-[1.2] text-white self-stretch">Video Call Link</FormLabel>
                          <FormControl>
                            <InputFieldDark type={InputFieldType.Link} placeholder={'Type URL'} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}
                  {selectedEventFormat === "online" && (
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
                  )}
                  {selectedEventFormat === "new" &&
                    eventSpace?.format === "online" && (
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
                    )}
                </div>
              </div>
              <line></line>
              <div className="w-full">
                <Label className="text-2xl opacity-80 font-semibold">
                  Roles
                </Label>
                <div className="flex flex-col gap-6 items-start pt-5">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-end gap-6 self-stretch">
                      <div className="flex flex-col gap-[14px] items-start w-full">
                        <h2 className="md:text-lg  font-semibold leading-[1.2] text-white self-stretch sm:text-base">
                          Enter Name
                        </h2>

                        <div className="flex w-full text-white outline-none rounded-lg pr-3 pl-2.5 bg-inputField gap-2.5 border border-white/10 border-opacity-10 items-center">
                          <Autocomplete
                            {...defaultSpeakers}
                            id="controlled-demo"
                            sx={{ color: "black", width: "100%" }}
                            color="black"
                            value={eventItem}
                            onChange={(event: any, newValue) => {
                              console.log("onChange", event, newValue);
                              if (newValue) {
                                // setTagItem({ name: newValue.name });
                                setEventItem({
                                  ...eventItem,
                                  name: newValue.name,
                                });
                              }
                            }}
                            onInputChange={(event, newInputValue) => {
                              setEventItem({
                                ...eventItem,
                                name: newInputValue,
                              });
                            }}
                            slotProps={{
                              paper: {
                                sx: {
                                  color: "white",
                                  backgroundColor: "#242727",
                                  pointerEvents: "auto",
                                },
                              },
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
                                label="Enter the name"
                                variant="standard"
                              />
                            )}
                          />
                        </div>
                        {/* <InputFieldDark
                                type={InputFieldType.Primary}
                                value={eventItem.name}
                                onChange={(e) =>
                                  setEventItem({
                                    ...eventItem,
                                    name: (e.target as HTMLInputElement).value,
                                  })
                                }
                                placeholder={'Enter the name'}
                              /> */}
                      </div>
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <h2 className="md:text-lg font-semibold leading-[1.2] text-white self-stretch sm:text-base">
                          Select Role
                        </h2>
                        <select
                          onChange={(e) =>
                            setEventItem({
                              ...eventItem,
                              role: e.target.value,
                            })
                          }
                          title="location"
                          value={eventItem.role}
                          className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                        >
                          <option value="organizer">Organizer</option>
                          <option value="speaker">Speaker</option>
                          <option value="facilitator">Facilitator</option>
                        </select>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        if (eventItem.name === "") return;
                        setOrganizers([...organizers, eventItem]);
                        setEventItem({ name: "", role: "speaker" });
                      }}
                      variant="quiet"
                      className="flex gap-2.5 w-full text-base font-semibold text-white items-center rounded-full py-1 justify-center duration-200"
                      leftIcon={FaCircleArrowDown}
                    >
                      Add Role
                    </Button>

                    <div className="flex flex-wrap gap-2.5">
                      {organizers?.map((organizer: any, index: number) => (
                        <div
                          key={index}
                          className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
                        >
                          <button
                            type="button"
                            className="flex gap-2.5 items-center"
                          >
                            <GoXCircle
                              onClick={() => handleRemoveOrganizer(index)}
                              className="top-0.5 left-0.5 w-4 h-4"
                            />
                            <span className="lg:text-lg sm:text-sm font-semibold text-white">
                              {organizer.name}
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-6">
                <Label className="text-2xl opacity-80 font-bold">
                  Session Labels
                </Label>
                <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                  <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                    Select Event Category
                  </Label>
                  <select
                    onChange={(e) => setEventCategory(e.target.value)}
                    value={eventCategory}
                    title="category"
                    className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                  >
                    {eventSpace?.event_type?.length === 0 ||
                      (eventSpace?.event_type === null && (
                        <option value="">No saved categories</option>
                      ))}
                    {eventSpace?.event_type?.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
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
                        <option value="">No saved experience levels</option>
                      ))}
                    {eventSpace?.experience_level?.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col items-start gap-6">
                  <div className="flex flex-col gap-[14px] items-start w-full">
                    <Label className="text-lg font-semibold text-white self-stretch">
                      Add Tags
                    </Label>
                    <div className="flex w-full text-white outline-none rounded-lg pr-3 pl-2.5 bg-inputField gap-2.5 border border-white/10 border-opacity-10 items-center">
                      <Autocomplete
                        {...defaultProps}
                        id="controlled-demo"
                        sx={{ color: "black", width: "100%" }}
                        color="black"
                        value={tagItem}
                        onChange={(event: any, newValue) => {
                          console.log("onChange", event, newValue);
                          if (newValue) {
                            setTagItem({ name: newValue.name });
                          }
                        }}
                        onInputChange={(event, newInputValue) => {
                          setTagItem({ name: newInputValue });
                        }}
                        slotProps={{
                          paper: {
                            sx: {
                              color: "white",
                              backgroundColor: "#242727",
                              pointerEvents: "auto",
                            },
                          },
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
                        className="flex gap-2.5 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-componentPrimary bg-opacity-10"
                      >
                        +
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                      {tags?.map((tag, index) => (
                        <div
                          key={index}
                          className="flex w-full items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
                        >
                          <button
                            type="button"
                            className="flex gap-2.5 items-center"
                          >
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
                <Label className="text-2xl opacity-80">Advanced</Label>
                <div className="flex flex-col items-center gap-5 pt-5">
                  <div className="flex items-center gap-5 self-stretch">
                    <SwitchButton value={isLimit} onClick={handleLimitRSVP} />
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
                        min="1"
                        className="bg-gray-600 w-full outline-none px-4 rounded-md py-2"
                        placeholder={"50"}
                        onChange={(e) =>
                          setRsvpAmount(e.target.value as unknown as number)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center pt-8">
                <div className="flex md:flex-row gap-[30px] w-full">
                  {/* <Button className="rounded-full w-full md:w-1/2 flex justify-center" variant="quiet" size="lg" type="button" leftIcon={CgClose}>
                    <span>Discard Session</span>
                  </Button> */}
                  <Button
                    className="rounded-full w-full md:w-full lg:w-full flex justify-center"
                    variant="blue"
                    size="lg"
                    leftIcon={FaCircleArrowUp}
                    disabled={loading}
                    onClick={() => form.handleSubmit(onSubmit)()}
                  >
                    <span>{loading ? "Adding" : "Add Session"}</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
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

  const locationsResult = await fetchLocationsByEventSpace(
    ctx.query.event_space_id
  );
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
