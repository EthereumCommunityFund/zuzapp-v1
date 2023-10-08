import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Button from '@/components/ui/buttons/Button';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';
import DetailsBar from '@/components/detailsbar';
import EditionButtons from '@/components/ui/buttons/EditionButtons';

import { CgClose } from 'react-icons/cg';
import { FaCircleArrowUp } from 'react-icons/fa6';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import FormTitle from '@/components/ui/labels/form-title';
import InputFieldDark from '@/components/ui/inputFieldDark';
import { EventSpaceDetailsType, InputFieldType, LocationUpdateRequestBody, ScheduleUpdateRequestBody } from '@/types';
import TextEditor from '@/components/ui/TextEditor';
import { Label } from '@/components/ui/label';
import SwitchButton from '@/components/ui/buttons/SwitchButton';
import { GoXCircle } from 'react-icons/go';
import InputFieldLabel from '@/components/ui/labels/inputFieldLabel';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import CustomDatePicker from '@/components/ui/DatePicker';
import { useRouter } from 'next/router';
import { fetchLocationsByEventSpace, createSchedule, fetchAllTags } from '@/controllers';
import { useQuery } from 'react-query';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
// import timepicker as Timepicker from "react-time-picker";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { v4 as uuidv4 } from 'uuid';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchScheduleByID, updateSchedule } from '../../../../../../controllers/schedule.controller';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';
import ScheduleEditForm from '@/components/commons/ScheduleEditForm';
import fetchSchedulesByTrackId from '@/services/fetchSchedulesByTrackId';
import { Loader } from '@/components/ui/Loader';

type Organizer = {
  name: string;
  role: string;
};

type TagItemProp = {
  name: string;
};


export default function UpdateSchedulePage() {
  const router = useRouter();
  const { event_space_id, trackId, scheduleId, track_title } = router.query;


  const {
    data: schedule,
    isLoading,
    isError,
  } = useQuery<ScheduleUpdateRequestBody, Error>(
    ['currentSchedule', scheduleId], // Query key
    () => fetchSchedulesByTrackId(trackId as string), // Query function
    {
      enabled: !!event_space_id, // Only execute the query if event_space_id is available
      onSuccess(data) {
        console.log(data);
      },
    }
  );


  // const formated = formatDate('2023-09-27T23:00:00+00:00');
  // console.log(formated, 'formated');

  if (isLoading) {
    return <Loader />
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
            <span className="text-sm opacity-70">You are editing a schedule for this track</span>
          </div>
        </div>
        {schedule &&
          <ScheduleEditForm
            name={schedule.name}
            format={schedule.format}
            description={schedule.description}
            date={schedule.date}
            start_time={schedule.start_time}
            end_time={schedule.end_time}
            schedule_frequency={schedule.schedule_frequency}
            location_id={schedule.location_id}
            event_space_id={event_space_id as string}
          />}
        {/* <div className="flex py-5 px-4 flex-col items-center gap-8 self-stretch rounded-2xl border border-[#FFFFFF10] bg-[#2E3131]">
          <div className="flex flex-col items-center gap-[34px] self-stretch w-full">
            <FormTitle name="Update Schedule" />
            {scheduleUpdated ? (
              <div className="flex flex-col items-center">
                <h3 className="font-bold text-xl">Your Schedule Has Been Updated</h3>

                <Button onClick={handleEnterTrack} variant="primary" className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full" leftIcon={HiArrowRight}>
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
                        <FormLabel className="text-2xl opacity-80 leading-[1.2]">Schedule Format</FormLabel>
                        <FormDescription>The format you select will determine what information will be required going forward</FormDescription>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            //  defaultValue={field.value}
                            className="flex flex-col md:flex-row justify-between"
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
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 hover:bg-btnPrimaryGreen/20 rounded-md">
                              <FormControl>
                                <RadioGroupItem value="hybrid" />
                              </FormControl>
                              <FormLabel className="font-semibold text-white/60 text-base">
                                Hybrid
                                <span className="text-xs block">In-Person & Online</span>
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
                        <FormLabel className="text-lg font-semibold leading-[1.2] text-white self-stretch">Schedule Name </FormLabel>
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
                        <div className="flex flex-col gap-[10px]">
                          <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Schedule Description</h2>
                          <TextEditor value={field.value} onChange={field.onChange} />
                        </div>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <h2 className="text-xl opacity-70 self-stretch">Schedule Date & Times</h2>
                    <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                      <div className="flex gap-5">
                        <SwitchButton value={schedule.all_day} onClick={handleChangeSwitch} />
                        <span className="text-lg opacity-70 self-stretch">All Day</span>
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
                              <div className="flex justify-between gap-10 text-white">
                                <TimePicker
                                  label="Start Time"
                                  // slotProps={{ textField: { color: 'white' }}}
                                  value={dayjs(schedule?.start_time) as unknown as string}
                                  // className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                                  onChange={(newValue: string | Date | null | undefined) =>
                                    setSchedule({
                                      ...schedule,
                                      start_time: newValue as string,
                                    })
                                  }
                                  sx={{
                                    input: {
                                      color: 'white',
                                    },
                                    label: {
                                      color: 'white',
                                    },
                                    svg: {
                                      color: 'white', // change the icon color
                                    },
                                    backgroundColor: '#242727',
                                    color: 'white',
                                    borderRadius: '8px',
                                    width: '100%',
                                    // borderColor: "white",
                                    // borderWidth: "1px",
                                    border: '1px solid #4b4a4a',
                                  }}
                                />
                                <TimePicker
                                  label="End Time"
                                  value={dayjs(schedule?.end_time) as unknown as string}
                                  onChange={(newValue: string | Date | null | undefined) =>
                                    setSchedule({
                                      ...schedule,
                                      end_time: newValue as string,
                                    })
                                  }
                                  sx={{
                                    input: {
                                      color: 'white',
                                    },
                                    label: {
                                      color: 'white',
                                    },
                                    svg: {
                                      color: 'white', // change the icon color
                                    },
                                    backgroundColor: '#242727',
                                    color: 'white',
                                    borderRadius: '8px',
                                    width: '100%',
                                    // borderColor: "white",
                                    // borderWidth: "1px",
                                    border: '1px solid #4b4a4a',
                                  }}
                                />
                              </div>
                            </LocalizationProvider>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select a Timezone</Label>
                        <select
                          // onChange={(e) => setFrequency(e.target.value as any)}
                          className="flex w-full text-white outline-none rounded-lg py-2.5 pr-3 pl-2.5 bg-inputField gap-2.5 items-center border border-white/10 border-opacity-10"
                          title="frequency"
                        >
                          <option value="once">UTC</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                        <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Schedule Frequency</Label>
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
                      <line></line>
                    </div>
                  </div>
                  <div className="w-full">
                    <h2 className="text-xl opacity-70 self-stretch font-semibold">Location</h2>
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
                    <div className="flex flex-col items-start gap-5 self-stretch w-full pt-5">
                      <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
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
                      </div>

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
                    </div>
                  </div>
                  <line></line>
                  <div className="w-full">
                    <h2 className="text-xl opacity-70 self-stretch font-semibold pb-5">Roles</h2>
                    <div className="flex flex-col gap-6 items-start self-stretch">
                      <div className="flex flex-col gap-6">
                        <div className="flex items-end gap-6 self-stretch">
                          <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                            <h2 className="text-lg font-semibold leading-[1.2] text-white self-stretch">Enter Name</h2>
                            <InputFieldDark
                              type={InputFieldType.Primary}
                              value={eventItem?.name}
                              onChange={(e) => {
                                console.log((e.target as HTMLInputElement).value);
                                setEventItem({
                                  ...eventItem,
                                  name: (e.target as HTMLInputElement).value,
                                });
                              }}
                              placeholder={'Enter the name'}
                            />
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

                          <button
                            type="button"
                            onClick={() => {
                              if (eventItem.name === '') return;
                              console.log(eventItem);
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
                            className="flex gap-2.5 mb-2 text-lg font-normal leading-[1.2] text-white items-center rounded-[8px] px-2 py-1 bg-white bg-opacity-10"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex gap-2.5">
                          {schedule.organizers?.map((organizer: any, index: number) => (
                            <div key={index} className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                              <button type="button" className="flex gap-2.5 items-center">
                                <GoXCircle onClick={() => handleRemoveSpeaker(index)} className="top-0.5 left-0.5 w-4 h-4" />
                                <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">{organizer.name ? organizer.name : organizer.name}</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col gap-6">
                    <h2 className="text-lg opacity-70 self-stretch font-bold pb-5">Schedule Labels</h2>
                    <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                      <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Event Category</Label>

                      <select
                        onChange={(e) => {
                          setSchedule({
                            ...schedule,
                            event_type: e.target.value,
                          });
                          // setInitialEvent(e.target.value)
                          console.log(schedule.event_type);
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
                    <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                      <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select Experience Level</Label>
                      

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
                          <Autocomplete
                            {...defaultProps}
                            id="controlled-demo"
                            sx={{ color: 'white', width: '100%' }}
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
                  <div className="w-full">
                    <span className="text-lg opacity-70 self-stretch">Advanced</span>
                    <div className="flex flex-col items-center gap-5 self-stretch">
                      <div className="flex items-center gap-5 self-stretch">
                        <SwitchButton value={schedule.limit_rsvp} onClick={handleLimitRSVP} />
                        <span className="flex-1 text-base font-semibold leading-[1.2]">Limit RSVPs</span>
                      </div>
                      {schedule.limit_rsvp && (
                        <div className="flex flex-col gap-[14px] items-start self-stretch w-full">
                          <Label className="text-lg font-semibold leading-[1.2] text-white self-stretch">Select an Amount</Label>
                          <input
                            type="number"
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
                    <div className="flex gap-[30px] w-full">
                      <Button className="rounded-full w-1/2 flex justify-center" variant="quiet" size="lg" type="button" leftIcon={CgClose}>
                        <span>Discard Schedule</span>
                      </Button>
                      <Button className="rounded-full w-1/2 flex justify-center" variant="blue" size="lg" type="submit" leftIcon={FaCircleArrowUp}>
                        <span>Update Schedule</span>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div> */}
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
