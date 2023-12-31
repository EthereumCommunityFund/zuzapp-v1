import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import Button from '@/components/ui/buttons/Button';
import { HiArrowLeft, HiArrowRight, HiXCircle } from 'react-icons/hi';

import { CgClose } from 'react-icons/cg';
import { FaCircleArrowDown, FaCircleArrowUp } from 'react-icons/fa6';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useRef } from 'react';
import FormTitle from '@/components/ui/labels/form-title';
import InputFieldDark from '@/components/ui/inputFieldDark';
import { EventSpaceDetailsType, InputFieldType, LocationUpdateRequestBody, ScheduleUpdateRequestBody } from '@/types';
import TextEditor from '@/components/ui/TextEditor';
import { Label } from '@/components/ui/label';
import SwitchButton from '@/components/ui/buttons/SwitchButton';
import { GoXCircle } from 'react-icons/go';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import CustomDatePicker from '@/components/ui/DatePicker';
import { useRouter } from 'next/router';
import { fetchLocationsByEventSpace, fetchAllTags, fetchScheduleByID, updateSchedule, createSchedule, fetchAllSpeakers } from '@/controllers';
import { useQuery } from 'react-query';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { toast } from '@/components/ui/use-toast';
import { Loader } from '../ui/Loader';
import { v4 as uuidv4 } from 'uuid';
import { sessionFrequency } from '@/constant/scheduleconstants';
import { X } from 'lucide-react';
import { deleteScheduleById } from '@/services/deleteSchedule';
import { fetchProfile } from '@/controllers/profile.controllers';
import { convertDateToString, convertToTurkeyTimeAsDate, fromTurkeyToUTC, stringToDateObject, toTurkeyTime } from '@/utils';
import { BsFillTicketFill } from 'react-icons/bs';
import { sessionNavBarDetails } from '@/constant/addschedulenavbar';
import { TimePicker } from 'antd';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

type Organizer = {
  name: string;
  role: string;
};

type TagItemProp = {
  name: string;
};

interface IEditScheduleForm {
  isQuickAccess: boolean;
  scheduleId: string;
  trackId: string;
  track_title?: string;
  event_space_id: string;
  isFromEventView: boolean;
  creatorId: string;
  updateIsLoading?: (newState: boolean) => void;
  edit?: (newState: boolean) => void;
}

export default function EditScheduleForm({ isQuickAccess, creatorId, scheduleId, trackId, event_space_id, isFromEventView, updateIsLoading, edit }: IEditScheduleForm) {
  const router = useRouter();

  const [userId, setUserId] = useState();

  const fetchUserProfile = async () => {
    const response = await fetchProfile();
    const userdata = response?.data?.data;
    setUserId(userdata?.uuid);
  };

  const [schedule, setSchedule] = useState<ScheduleUpdateRequestBody>({
    name: '',
    format: 'in-person',
    description: '',
    date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    all_day: undefined,
    schedule_frequency: 'once',
    images: [''],
    video_call_link: '',
    live_stream_url: '',
    location_id: '',
    event_type: '',
    experience_level: '',
    limit_rsvp: false,
    rsvp_amount: 1,
    event_space_id: '',
    track_id: '',
    tags: [''],
    organizers: [
      {
        name: '',
        role: '',
      },
    ],
    current_rsvp_no: 0,
    editlogs: '',
  });
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [optionTags, setOptionTags] = useState<TagItemProp[]>([]);
  const [optionSpeakers, setOptionSpeakers] = useState<TagItemProp[]>([]);
  const [tagItem, setTagItem] = useState<TagItemProp>({ name: '' });
  const [eventItem, setEventItem] = useState({
    name: '',
    role: 'speaker',
  });
  const [organizers, setOrganizers] = useState<any>([]);
  const [frequency, setFrequency] = useState<'once' | 'everyday' | 'weekly'>('once');
  const [savedLocations, setSavedLocations] = useState<LocationUpdateRequestBody[]>([]);
  const [locationId, setLocationId] = useState('');
  const [dialog, setDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);

  const handleChangeSwitch = () => {
    setSchedule({ ...schedule, all_day: !schedule.all_day });
  };

  const [scheduleUpdated, setScheduleUpdated] = useState(false);

  const [loading, setIsLoading] = useState(false);
  const [updating, setIsUpdating] = useState(false);

  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  const handleDeleteSchedule = async () => {
    if (!scheduleId) return;
    try {
      setIsLoading(true);
      await deleteScheduleById(scheduleId as string, event_space_id as string);
      toast({
        title: 'session deleted successfully',
      });
      router.push({
        pathname: `/dashboard/eventview/allschedules`,
        query: {
          event_space_id,
        },
      });
    } catch (error) {
      console.error('Error deleting the schedule', error);
    } finally {
      setIsLoading(false);
    }
  };
  const formSchema = z.object({
    name: z.string().min(2, {
      message: 'Session name is required.',
    }),
    format: z.enum(['in-person', 'online'], {
      required_error: 'You need to select a format.',
    }),
    date: z
      .date({
        required_error: 'You need to select a valid date for this Session.',
        invalid_type_error: 'You need to select a valid date for this Session.',
      })
      .refine(
        (date) => {
          if (date) {
            const today = dayjs().startOf('day');
            const selectedDate = dayjs(date);
            return selectedDate.isSameOrAfter(today);
          }
          return true;
        },
        {
          message: 'You need to select a date that is today or in the future.',
        }
      ),
    end_date: z
      .date({
        required_error: 'You need to select a valid date for this event.',
        invalid_type_error: 'You need to select a valid date for this event.',
      })
      .optional(),
    description: z.string().min(10, {
      message: 'Description is required and must be a minimum of 10 characters',
    }),
    video_call_link: z.string().optional().or(z.literal('')),
    live_stream_url: z.string().optional().or(z.literal('')),
  });

  console.log(schedule);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: schedule?.name,
      format: schedule?.format,
      date: stringToDateObject(schedule.start_date as string),
      end_date: stringToDateObject(schedule.real_end_date as string),
      description: '',
      video_call_link: '',
      live_stream_url: schedule?.live_stream_url,
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
  const track_title = eventSpace?.tracks.find((track) => track.id === trackId)?.name;

  const handleLimitRSVP = () => {
    setSchedule({ ...schedule, limit_rsvp: !schedule.limit_rsvp });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.format !== 'in-person' && (!values.live_stream_url || values.live_stream_url === '')) {
      form.setError('live_stream_url', {
        message: 'Live stream link is required for online events',
      });
      return;
    }
    if (values.format === 'in-person' && locationId === '') {
      toast({
        title: 'Error',
        description: 'Location is required for in-person events',
        variant: 'destructive',
      });
      return;
    }
    if (frequency === 'everyday' || frequency === 'weekly') {
      const endDate = fromTurkeyToUTC(values.end_date);
      const startDate = fromTurkeyToUTC(values.date);

      if (endDate.isBefore(startDate)) {
        form.setError('end_date', {
          message: 'End date cannot be earlier than start date',
        });
        return;
      }
    }
    const updatedOrganizers = (schedule.organizers as any).map((user: any) => {
      if (user.name) {
        return {
          ...user,
          name: user.name,
          role: 'speaker',
        };
      } else {
        return {
          ...user,
        };
      }
    });

    const additionalPayload = {
      event_space_id: schedule.event_space_id,
      start_time: schedule.start_time as unknown as string,
      end_time: schedule.end_time as unknown as string,
      event_type: (schedule.event_type as unknown as []).length > 0 ? JSON.stringify([schedule.event_type]) : ((eventSpace?.event_type as string[])[0] as unknown as string[]),
      experience_level:
        (schedule.experience_level as unknown as []).length > 0 ? (JSON.stringify([schedule.experience_level]) as unknown as string[]) : [(eventSpace?.experience_level as string[])[0]],
      tags: schedule.tags,
      schedule_frequency: schedule.schedule_frequency,
      location_id: schedule.location_id,
      organizers: updatedOrganizers,
      video_call_link: schedule.video_call_link,
      // live_stream_url: schedule.live_stream_url,
      all_day: schedule.all_day,
      track_id: trackId,
      limit_rsvp: schedule.limit_rsvp,
      date: convertDateToString(values.date as Date),
      end_date: convertDateToString(values.end_date as Date),
      ...(eventSpace?.event_space_type === 'tracks' && {
        track_id: trackId as string,
      }),
      ...(schedule.limit_rsvp ? { rsvp_amount: schedule.rsvp_amount } : {}),
      // isLimit && rsvp_amount: rsvpAmount
    };

    const payload: any = { ...values, ...additionalPayload };
    try {
      setIsUpdating(true);
      const result = await updateSchedule(scheduleId as string, payload, event_space_id as string);
      // setSwitchDialogue(true);
      setScheduleUpdated(true);
      // toast({
      //   title: 'Session updated successfully',
      // });
    } catch (error: any) {
      console.log(error);
      toast({
        title: 'Error',
        description: error?.response.data?.error,
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(true);
    }
  }

  const handleRemoveSpeaker = (index: number) => {
    const updatedItems = [...(schedule.organizers as Organizer[]).slice(0, index), ...(schedule.organizers as Organizer[]).slice(index + 1)];
    setSchedule({ ...schedule, organizers: updatedItems as any });
  };

  const handleRemoveTag = (index: number) => {
    const updatedItems = [...(schedule.tags as string[]).slice(0, index), ...(schedule.tags as string[]).slice(index + 1)];
    setSchedule({ ...schedule, tags: updatedItems });
  };

  const defaultProps = {
    options: optionTags,
    getOptionLabel: (option: { name: string }) => option.name,
  };

  const defaultSpeakers = {
    options: optionSpeakers,
    getOptionLabel: (option: { name: string }) => option.name,
  };

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        const result = await fetchLocationsByEventSpace(event_space_id as string);
        setSavedLocations(result?.data?.data);
        setLocationId(result.data.data[0].id);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTags = async () => {
      try {
        const result = await fetchAllTags();
        setOptionTags(result.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSpeakers = async () => {
      try {
        const result = await fetchAllSpeakers();
        setOptionSpeakers(result.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCurrentSchedule = async () => {
      try {
        const result = await fetchScheduleByID(scheduleId as string);
        setSchedule({
          ...result.data.data,
          event_type: JSON.parse(result.data.data.event_type)[0],
          experience_level: JSON.parse(result.data.data.experience_level)[0],
        });

        setStartDate(stringToDateObject(result.data.data.start_date as string));

        form.reset({
          name: result.data.data.name,
          format: result.data.data.format,
          date: stringToDateObject(result.data.data.start_date as string),
          end_date: stringToDateObject(result.data.data.real_end_date as string),
          description: result.data.data.description,
          // video_call_link: result.data.data.video_call_link,
          live_stream_url: result.data.data.live_stream_url,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchCurrentSchedule();

    fetchLocationDetails();
    fetchTags();
    fetchSpeakers();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    //get the first item from the errors object
    const firstError = Object.values(form.formState.errors)[0];
    if (firstError) {
      toast({
        title: 'Error',
        description: firstError?.message,
        variant: 'destructive',
      });
    }
  }, [form.formState.errors]);

  const handleEnterEventViewSessions = () => {
    updateIsLoading && updateIsLoading(true);
    try {
      router.push({
        pathname: isQuickAccess ? `/dashboard/eventview/allschedules` : `/dashboard/eventview/tracks/track`,
        query: {
          event_space_id: event_space_id,
          trackId: trackId,
        },
      });
    } catch (error) {
      console.error('Error redirecting schedulelists', error);
    }
  };

  const handleEnterSessions = () => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules`,
        query: {
          event_space_id: event_space_id,
          track_title: track_title,
          trackId: isQuickAccess ? schedule.track_id : trackId,
        },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };
  const customTimePickerInputStyle = `
  .custom-time-picker.ant-picker .ant-picker-input input {
    color: #FFFFFF !important; 
  }
`;
  const checkFormDirt = () => {
    const hasDirtyFields = Object.keys(form.formState.dirtyFields).length > 0;
    if (hasDirtyFields) {
      setDialog(true);
    } else {
      if (isFromEventView) {
        if (edit) {
          edit(false);
        }
      } else {
        router.back();
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className={`flex items-start gap-8 ${isFromEventView ? `flex-col` : `flex-row`} w-full`}>
      {!isFromEventView && (
        <div className="lg:flex hidden flex-col pt-3 rounded-s-xl opacity-70 w-[300px] gap-5 fixed">
          <div className="flex gap-[10px] pl-3 items-center font-semibold text-2xl">
            <BsFillTicketFill className="w-5 h-5 text-2xl" /> Session
          </div>
          <div className="flex flex-col gap-3 text-xl">
            {sessionNavBarDetails.map((item, index) => {
              return (
                <div key={index} className="rounded-xl flex flex-col py-2 gap-1 hover:cursor-pointer w-[230px] hover:bg-[#292929] duration-200" onClick={() => scrollToRef(sectionRefs[index])}>
                  <h2 className="px-3.5 hover: cursor-pointer font-semibold">{item.name}</h2>
                  <h3 className="px-3.5 hover: cursor-pointer text-xs font-light opacity-60">{item.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={`flex flex-col items-start gap-[17px] ${isFromEventView ? `` : `lg:ml-[300px]`} w-full`}>
        {!isFromEventView && (
          <Button
            className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
            size="lg"
            leftIcon={HiArrowLeft}
            onClick={() => {
              checkFormDirt();
            }}
          >
            Back
          </Button>
        )}
        <Dialog open={dialog} onOpenChange={(open) => setDialog(open)}>
          <DialogContent className="sm:max-w-[425px] h-auto rounded-2xl">
            <DialogHeader>
              <DialogTitle>Discard edit?</DialogTitle>
              <DialogDescription className="text-sm font-bold">You can choose to save your edit or discard your edit before going back.</DialogDescription>
              <DialogFooter className="pt-5">
                <div className="flex justify-between items-center">
                  <button onClick={form.handleSubmit(onSubmit)} className="py-2.5 px-3.5 flex items-center gap-1 rounded-[20px] bg-emerald-800">
                    <span>Save edit</span>
                  </button>
                  <button onClick={() => router.back()} className="py-2.5 px-3.5 flex items-center gap-1 text-[#FF5E5E] rounded-[20px] bg-[#EB5757]/20">
                    <HiXCircle />
                    <span>Discard edit</span>
                  </button>
                </div>
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={scheduleUpdated} onOpenChange={(open) => setUpdateDialog(open)}>
          <DialogContent className="sm:max-w-[525px] h-auto rounded-2xl">
            <DialogHeader className="my-2">
              <DialogTitle>Session Updated</DialogTitle>
            </DialogHeader>
            <div className="text-sm font-light text-white/70 my-2">You can edit your session details.</div>
            <div className="font-normal text-white my-2">Now go to Sessions and continue</div>
            <DialogFooter>
              <Button
                onClick={isFromEventView ? handleEnterEventViewSessions : handleEnterSessions}
                variant="primary"
                className="bg-[#67DBFF]/20 text-[#67DBFF] text-lg w-full justify-center rounded-full"
                leftIcon={HiArrowRight}
              >
                Go to sessions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className={`flex flex-col items-center gap-8 rounded-2xl py-5 ${isFromEventView ? `border-none` : `px-4 border border-white/10 bg-componentPrimary`}   text-white w-full`}>
          <div className="flex flex-col items-center gap-[34px] w-full max-w-[1000px]">
            <>
              <div className="flex justify-between items-center w-full">
                <FormTitle name="Update Session" />
                {isFromEventView && (
                  <Button onClick={checkFormDirt} size="sm" className="rounded-full w-10 h-10">
                    <X />
                  </Button>
                )}
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 w-full">
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-2xl opacity-80 leading-[1.2]" ref={sectionRefs[0]}>
                          Session Format
                        </FormLabel>
                        <FormDescription>The format you select will determine what information will be required going forward</FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            //  defaultValue={field.value}
                            className="flex flex-col md:flex-row"
                            {...field}
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 hover:bg-btnPrimaryGreen/20 rounded-md focus:bg-btnPrimaryGreen/20">
                              <FormControl>
                                <RadioGroupItem value="in-person" />
                              </FormControl>
                              <FormLabel className="font-semibold text-white/60 text-base">
                                In-Person
                                <span className="text-xs block">This is a physical event</span>
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 hover:bg-btnPrimaryGreen/20 rounded-md">
                              <FormControl>
                                <RadioGroupItem value="online" />
                              </FormControl>
                              <FormLabel className="font-semibold text-white/60 text-base ">
                                Online
                                <span className="text-xs block">Specifically Online Event</span>
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
                        <FormLabel className="text-lg font-semibold leading-[1.2] text-white">Session Name </FormLabel>
                        <FormControl>
                          <InputFieldDark type={InputFieldType.Primary} placeholder={'Enter a name for your event'} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <div className="flex flex-col gap-[10px]" ref={sectionRefs[1]}>
                          <Label className="text-2xl text-white/80">Session Description</Label>
                          <TextEditor value={field.value} onChange={field.onChange} />
                        </div>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <h2 className="text-2xl text-white/80" ref={sectionRefs[2]}>
                      Session Date & Times
                    </h2>
                    <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                      <div className="flex gap-5">
                        <SwitchButton value={schedule.all_day} onClick={handleChangeSwitch} />
                        <span className="text-lg opacity-70 self-stretch">All Day</span>
                      </div>
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Session Frequency</Label>
                        <select
                          value={schedule.schedule_frequency}
                          onChange={(e) =>
                            setSchedule({
                              ...schedule,
                              schedule_frequency: e.target.value as any,
                            })
                          }
                          className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                          title="frequency"
                        >
                          <option value="once">Once</option>
                          <option value="everyday">Everyday</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <div className="flex flex-col items-center gap-[30px] self-stretch w-full">
                        {schedule.date !== '' && (
                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                                <span className="text-lg opacity-70 self-stretch">Start Date</span>
                                <CustomDatePicker defaultDate={undefined} selectedDate={startDate as Date} handleDateChange={field.onChange} {...field} />
                                <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
                                <FormMessage />
                              </div>
                            )}
                          />
                        )}

                        {!schedule.all_day && (
                          <>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <div className="flex justify-between gap-10 text-white w-full">
                                <TimePicker
                                  placeholder="Select Start Time"
                                  size="large"
                                  format="h:mm a"
                                  value={toTurkeyTime(schedule?.start_time)}
                                  className="custom-time-picker flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                                  popupStyle={{
                                    pointerEvents: 'auto',
                                  }}
                                  onSelect={(newValue: any) => {
                                    let _time = fromTurkeyToUTC(newValue);
                                    setSchedule({
                                      ...schedule,
                                      start_time: _time as string,
                                    });
                                  }}
                                />
                                <TimePicker
                                  placeholder="Select End Time"
                                  size="large"
                                  format="h:mm a"
                                  value={toTurkeyTime(schedule.end_time)}
                                  className="custom-time-picker flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                                  popupStyle={{
                                    pointerEvents: 'auto',
                                  }}
                                  onSelect={(newValue: any) => {
                                    let _time = fromTurkeyToUTC(newValue);
                                    setSchedule({
                                      ...schedule,
                                      end_time: _time as string,
                                    });
                                  }}
                                />
                              </div>
                              <div className="w-full flex flex-col gap-2">
                                <Label className="text-[#FFDD87] md:text-base sm:text-sm">Times here will temporarily only be set to the Istanbul timezone</Label>
                                <Label className="md:text-sm sm:text-xs">(Dynamic timezones will be added soon)</Label>
                              </div>
                            </LocalizationProvider>
                            <style>{customTimePickerInputStyle}</style>
                          </>
                        )}
                      </div>
                      {(schedule?.schedule_frequency === sessionFrequency.WEEKLY || schedule?.schedule_frequency === sessionFrequency.EVERYDAY) && (
                        <div className="flex flex-col items-center gap-[30px] self-stretch w-full">
                          <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                              <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                                <span className="text-lg opacity-70 self-stretch">End Date</span>

                                <CustomDatePicker defaultDate={undefined} selectedDate={field.value || null} handleDateChange={field.onChange} {...field} />

                                <h3 className="opacity-70 h-3 font-normal text-[10px] leading-3">Click & Select or type in a date</h3>
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
                    {form.getValues('format') === 'in-person' && (
                      <>
                        <h2 className="text-2xl text-white/80" ref={sectionRefs[3]}>
                          Location
                        </h2>
                        <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                          <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                            <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Location</Label>

                            <select
                              onChange={(e) =>
                                setSchedule({
                                  ...schedule,
                                  location_id: e.target.value,
                                })
                              }
                              title="location"
                              value={schedule.location_id}
                              className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                            >
                              {savedLocations?.map((location) => (
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
                      {form.getValues('format') === 'online' && (
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <FormField
                            control={form.control}
                            name="live_stream_url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-lg font-semibold leading-[1.2] text-white self-stretch">Live Stream Link</FormLabel>
                                <FormControl>
                                  <InputFieldDark type={InputFieldType.Link} placeholder={'Type URL'} {...field} />
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
                  <div className="w-full" ref={sectionRefs[4]}>
                    <Label className="text-2xl text-white/80">Roles</Label>
                    <div className="flex flex-col gap-6 items-start pt-5">
                      <div className="flex flex-col gap-6 w-full">
                        <div className="flex items-end gap-6 self-stretch">
                          <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                            <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Enter Name</h2>
                            <div className="flex w-full text-white outline-none rounded-lg pr-3 pl-2.5 bg-inputField gap-2.5 border border-white/10 border-opacity-10 items-center">
                              <Autocomplete
                                {...defaultSpeakers}
                                id="controlled-demo"
                                sx={{ color: 'black', width: '100%' }}
                                color="black"
                                value={eventItem}
                                onChange={(event: any, newValue) => {
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
                                      color: 'white',
                                      backgroundColor: '#242727',
                                    },
                                  },
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    sx={{
                                      color: 'white',
                                      input: {
                                        color: 'white',
                                      },
                                      label: {
                                        color: 'white',
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
                                value={eventItem?.name}
                                onChange={(e) => {
                                  setEventItem({
                                    ...eventItem,
                                    name: (e.target as HTMLInputElement).value,
                                  });
                                }}
                                placeholder={'Enter the name'}
                              /> */}
                          </div>
                          <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                            <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Role</h2>
                            <select
                              title="speaker"
                              value={eventItem.role}
                              onChange={(e) =>
                                setEventItem({
                                  ...eventItem,
                                  role: e.target.value,
                                })
                              }
                              className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                            >
                              <option value="speaker">Speaker</option>
                              <option value="organizer">Organizer</option>
                              <option value="facilitator">Facilitator</option>
                            </select>
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            if (eventItem.name === '') return;
                            setSchedule({
                              ...schedule,
                              organizers: [...(schedule.organizers as Organizer[]), eventItem],
                            });
                            setOrganizers([...organizers, eventItem]);
                            setEventItem({
                              name: '',
                              role: 'speaker',
                            });
                          }}
                          variant="quiet"
                          className="flex gap-2.5 w-full text-base font-semibold text-white items-center rounded-full py-1 justify-center duration-200 p-2"
                          leftIcon={FaCircleArrowDown}
                        >
                          Add Role
                        </Button>

                        <div className="flex flex-wrap gap-2.5">
                          {schedule.organizers?.map((organizer: any, index: number) => (
                            <div key={index} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                              <button type="button" className="flex gap-2.5 items-center">
                                <GoXCircle onClick={() => handleRemoveSpeaker(index)} className="top-0.5 left-0.5 w-4 h-4" />
                                <span className="lg:text-lg sm:text-sm font-semibold text-white">{organizer.name ? organizer.name : organizer.name}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-6" ref={sectionRefs[5]}>
                    <Label className="text-2xl text-white/80">Session Labels</Label>
                    <div className="flex flex-col gap-[14px] items-start w-full">
                      <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Event Category</Label>

                      <select
                        onChange={(e) => {
                          setSchedule({
                            ...schedule,
                            event_type: e.target.value,
                          });
                          // setInitialEvent(e.target.value)
                        }}
                        value={schedule.event_type}
                        // value={schedule.event_type}
                        title="category"
                        className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                      >
                        {eventSpace?.event_type?.map((category, index) => {
                          const id = uuidv4();
                          return (
                            <option key={id} value={category}>
                              {category}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex flex-col gap-[14px] items-start w-full">
                      <Label className="text-lg font-semibold text-whit">Select Experience Level</Label>

                      <select
                        onChange={(e) =>
                          setSchedule({
                            ...schedule,
                            experience_level: e.target.value,
                          })
                        }
                        value={schedule.experience_level}
                        title="category"
                        className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                      >
                        {eventSpace?.experience_level?.map((category) => {
                          const id = uuidv4();
                          return (
                            <option key={id} value={category}>
                              {category}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex flex-col items-start gap-6 self-stretch">
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Add Tags</Label>
                        <div className="flex w-full text-white gap-5">
                          <div className="flex w-full text-white outline-none rounded-lg pr-3 pl-2.5 bg-inputField gap-2.5 border border-white/10 border-opacity-10 items-center">
                            <Autocomplete
                              {...defaultProps}
                              id="controlled-demo"
                              value={tagItem}
                              onChange={(event: any, newValue) => {
                                if (newValue) {
                                  setTagItem({ name: newValue.name });
                                }
                              }}
                              slotProps={{
                                paper: {
                                  sx: {
                                    color: 'white',
                                    backgroundColor: '#242727',
                                  },
                                },
                              }}
                              sx={{ color: 'black', width: '100%' }}
                              color="black"
                              onInputChange={(event, newInputValue) => {
                                setTagItem({ name: newInputValue });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  sx={{
                                    color: 'white',
                                    input: {
                                      color: 'white',
                                    },
                                    label: {
                                      color: 'white',
                                    },
                                  }}
                                  {...params}
                                  label="tags"
                                  variant="standard"
                                />
                              )}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (tagItem.name === '') return;
                              setSchedule({
                                ...schedule,
                                tags: [...(schedule.tags as string[]), tagItem.name],
                              });
                              setTagItem({ name: '' });
                            }}
                            className="flex gap-2.5 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-white bg-opacity-10"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex gap-2.5">
                          {schedule.tags?.map((tag, index) => {
                            const id = uuidv4();
                            return (
                              <div key={id} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                                <button type="button" className="flex gap-2.5 items-center">
                                  <GoXCircle onClick={() => handleRemoveTag(index)} className="top-0.5 left-0.5 w-4 h-4" />
                                  <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">{tag}</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <line />
                    </div>
                  </div>
                  <div className="w-full gap-6" ref={sectionRefs[6]}>
                    <Label className="text-2xl text-white/80">Advanced</Label>
                    <div className="flex flex-col items-center gap-5 self-stretch pt-5">
                      <div className="flex items-center gap-5 self-stretch">
                        <SwitchButton value={schedule.limit_rsvp} onClick={handleLimitRSVP} />
                        <span className="flex-1 text-base font-semibold leading-[1.2]">Limit RSVPs</span>
                      </div>
                      {schedule.limit_rsvp && (
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select an Amount</Label>
                          <input
                            type="number"
                            min="1"
                            className="bg-gray-600 w-full outline-none px-4 rounded-md py-2"
                            placeholder={'50'}
                            value={schedule.rsvp_amount}
                            onChange={(e) =>
                              setSchedule({
                                ...schedule,
                                rsvp_amount: e.target.value as unknown as number,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center pt-8">
                    <div className="flex flex-col lg:flex-row gap-[30px] w-full">
                      {/* <Button className="rounded-full w-full lg:w-1/2 flex justify-center" variant="quiet" size="lg" type="button" leftIcon={CgClose}>
                            <span>Discard Session</span>
                          </Button> */}
                      <Button
                        className="rounded-full w-full md:w-full lg:w-full flex justify-center"
                        variant="blue"
                        size="lg"
                        leftIcon={FaCircleArrowUp}
                        disabled={updating}
                        onClick={() => form.handleSubmit(onSubmit)()}
                      >
                        <span>{updating ? 'Updating' : 'Update Session'}</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
              {/* <Button variant="red" className="rounded-full w-full lg:w-1/2 flex justify-center" size="lg" onClick={handleDeleteSchedule} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </Button> */}
              {(!isFromEventView || (isFromEventView && creatorId === userId)) && (
                <Button variant="red" className="rounded-full w-full lg:w-1/2 flex justify-center" size="lg" onClick={handleDeleteSchedule} disabled={loading}>
                  {loading ? 'Deleting...' : 'Delete'}
                </Button>
              )}
            </>
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
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
