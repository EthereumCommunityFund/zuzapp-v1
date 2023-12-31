import EventViewHeader from '@/components/eventview/EventViewHeader';
import UserFacingTrack from '@/components/ui/UserFacingTrack';
import Button from '@/components/ui/buttons/Button';
import { LocationType, ScheduleDetailstype } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { QueryClient, useQuery } from 'react-query';
import { EventSpaceDetailsType } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import AddScheduleForm from '@/components/commons/AddScheduleForm';
import { useGlobalContext } from '@/context/GlobalContext';
import { Listbox, Transition } from '@headlessui/react';

import ToggleSwitch from '../commons/ToggleSwitch';
import { TbChevronDown } from 'react-icons/tb';
import { sortGroupedSchedulesByStartTime, stringToDateObject, toTurkeyTime } from '@/utils';
import { toast } from '../ui/use-toast';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import SwitchButton from '../ui/buttons/SwitchButton';
import { fetchAllSpeakers, fetchSchedulesByUserRsvp } from '@/controllers';
import { DropDownMenu } from '../ui/DropDownMenu';

interface ISessionViewPageTemplate {
  event_space_id: string;
  trackId?: string;
  eventSpace: EventSpaceDetailsType;
  speakers: any[];
}

export default function SessionViewPageTemplate({ event_space_id, trackId, eventSpace, speakers }: ISessionViewPageTemplate) {
  const router = useRouter();
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleDetailstype[]>([]);
  const lastTrackRef = useRef<HTMLDivElement>(null);
  const [isUpcoming, setIsUpcoming] = useState<boolean>(true);
  const [selectedTracks, setSelectedTracks] = useState<any[]>([]);
  const { isAuthenticated, user } = useGlobalContext();
  const [isMyRSVP, setIsMyRSVP] = useState<boolean>(false);
  const [groupedMyRSVPs, setGroupedMyRSVPs] = useState<Record<string, ScheduleDetailstype[]>>();
  const [selectedSpaces, setSelectedSpaces] = useState<any[]>([]);
  const [addASessionDialogOpen, setAddASessionDialogOpen] = useState<boolean>(false);
  const [selectedSpeakers, setSelectedSpeakers] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const storageKeys = {
    CONTAINER_SCROLL_POSITION: 'containerScrollPosition',
    WINDOW_SCROLL_POSITION: 'windowScrollPosition',
  };
  const handleItemClick = (scheduleId: string, trackId?: string) => {
    router.push({
      pathname: `/dashboard/eventview/allschedules/schedule`,
      query: { scheduleId, trackId, event_space_id },
    });
  };

  const sortByUpcoming = (schedules: ScheduleDetailstype[] | undefined, isUpcoming: boolean): ScheduleDetailstype[] => {
    if (!schedules) return [];
    const isUpcomingEvent = (schedule: ScheduleDetailstype) => {
      // console.log(schedule, 'isUpcoming');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const startDate = stringToDateObject(schedule.start_date);
      const endDate = stringToDateObject(schedule.real_end_date);

      // For non-recurring events:
      if (!schedule.schedule_frequency || schedule.schedule_frequency === 'once') {
        const [hours, minutes] = schedule.start_time.split(':').map(Number);
        startDate.setHours(hours, minutes, 0, 0);

        return isUpcoming ? startDate >= today : startDate < today;
      }

      if (schedule.schedule_frequency === 'everyday' || schedule.schedule_frequency === 'weekly') {
        if (isUpcoming) {
          return endDate >= today; // It's upcoming if the end date is today or in the future.
        } else {
          return startDate < today;
        }
      }
    };
    const filter: ScheduleDetailstype[] = schedules.filter(isUpcomingEvent);
    return filter;
  };

  const filterByTrack = (schedules: ScheduleDetailstype[]) => {
    const selectedTrackIds = selectedTracks.map((item) => item.id);
    const filteredSchedules =
      selectedTrackIds.length > 0
        ? schedules.filter((schedule) => {
            if (schedule.track_id) return selectedTrackIds.includes(schedule.track_id);
          })
        : schedules;
    return filteredSchedules;
  };

  const filterBySpace = (schedules: ScheduleDetailstype[]) => {
    const selectedSpaceIds = selectedSpaces.map((item) => item.id);
    // console.log(selectedSpaceIds, 'selectedSpaceIds:');
    const filteredSchedules =
      selectedSpaceIds.length > 0
        ? schedules.filter((schedule) => {
            // if (schedule.location_id)
            //   console.log(schedule.location_id, 'schedule.location_id', selectedSpaceIds.includes(schedule.location_id));
            return selectedSpaceIds.includes(schedule.location_id);
          })
        : schedules;
    return filteredSchedules;
  };

  const filterBySpeaker = (schedules: ScheduleDetailstype[]) => {
    const filteredSchedules =
      selectedSpeakers.length > 0
        ? schedules.filter((schedule) => selectedSpeakers.every((speakerName) => schedule.organizers?.some((organizer) => organizer.name.trim() === speakerName)))
        : schedules;
    return filteredSchedules;
  };

  const handleTrackSelect = (newSelectedTracks: any[]) => {
    // console.log(newSelectedTracks, "new selected tracks");
    setSelectedTracks(newSelectedTracks);
    return;
  };
  const handleIsUpcoming = (newFilter: boolean) => {
    setIsUpcoming(newFilter);
  };

  const handleSpaceSelect = (newSelectedSpaces: any[]) => {
    setSelectedSpaces(newSelectedSpaces);
  };

  const handleSpeakerSelect = (newSelectedSpeakers: any[]) => {
    setSelectedSpeakers(newSelectedSpeakers);
  };

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //       }
  //     },
  //     { threshold: 1 }
  //   );

  //   if (lastTrackRef.current) {
  //     observer.observe(lastTrackRef.current);
  //   }
  //   return () => {
  //     if (lastTrackRef.current) {
  //       observer.unobserve(lastTrackRef.current);
  //     }
  //   };
  // }, [lastTrackRef]);

  const {
    data: schedules,
    isLoading,
    isError,
  } = useQuery<ScheduleDetailstype[], Error>(
    ['allSchedules', event_space_id], // Query key
    () => fetchSchedulesByEvenSpaceId(event_space_id as string),
    {
      onSuccess: (data) => {
        // setSchedules(data);
      },
      onError: (error) => {
        console.log(error, 'error loading events');
        toast({
          title: 'Error',
          description: 'Error loading  Sessions',
          variant: 'destructive',
        });
      },
    }
  );

  const groupingSchedules = (allSchedules: ScheduleDetailstype[], groupedSchedules: Record<string, ScheduleDetailstype[]>) => {
    allSchedules.forEach((schedule) => {
      let isFirstEvent = true;
      let date = stringToDateObject(schedule.start_date as string);
      const end_date = stringToDateObject(schedule.real_end_date as string);
      const frequency = schedule.schedule_frequency;

      do {
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const newSchedule = {
          ...schedule,
          repeating: !isFirstEvent && (frequency === 'everyday' || frequency === 'weekly'),
        } as ScheduleDetailstype & { repeating: boolean };

        if (!groupedSchedules[formattedDate]) {
          groupedSchedules[formattedDate] = [];
        }

        groupedSchedules[formattedDate].push(newSchedule);

        if (frequency === 'everyday') {
          date.setDate(date.getDate() + 1);
        } else if (frequency === 'weekly') {
          date.setDate(date.getDate() + 7);
        } else {
          break;
        }

        isFirstEvent = false;
      } while (date <= end_date);
    });
  };

  let sortedSchedules = sortByUpcoming(schedules, isUpcoming);
  sortedSchedules = filterByTrack(sortedSchedules);
  sortedSchedules = filterBySpace(sortedSchedules);
  sortedSchedules = filterBySpeaker(sortedSchedules);
  let groupedSchedules: Record<string, ScheduleDetailstype[]> = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // console.log(sortedSchedules, 'sortedSchedules');
  groupingSchedules(sortedSchedules, groupedSchedules);

  // Now, let's categorize them into "past" and "upcoming"

  const pastSchedules: Record<string, ScheduleDetailstype[]> = {};
  const upcomingSchedules: Record<string, ScheduleDetailstype[]> = {};

  for (const dateStr in groupedSchedules) {
    const dateOfGroup = new Date(dateStr);

    if (dateOfGroup < today) {
      pastSchedules[dateStr] = groupedSchedules[dateStr];
    } else {
      upcomingSchedules[dateStr] = groupedSchedules[dateStr];
    }
  }

  if (selectedSpaces.length === 0 && selectedTracks.length === 0) groupedSchedules = isUpcoming ? upcomingSchedules : pastSchedules;
  // Now, pastSchedules contains all the past events and upcomingSchedules contains the upcoming ones.

  let chosenSchedules = sortGroupedSchedulesByStartTime(groupedSchedules);

  const handleShowMyRSVPs = async () => {
    const result = await fetchSchedulesByUserRsvp();
    const myRSVPs: ScheduleDetailstype[] = result.data.data;
    let groupedSchedules: Record<string, ScheduleDetailstype[]> = {};
    groupingSchedules(myRSVPs, groupedSchedules);
    setGroupedMyRSVPs(groupedSchedules);
    setIsMyRSVP((prev) => !prev);
  };

  const getLocationNameById = (id: string, locations: LocationType[]): string => {
    const location = locations.find((location) => location.id === id);
    return location?.name as string;
  };

  const saveCurrentPosition = () => {
    if (containerRef.current === null) return;
    sessionStorage.setItem(storageKeys.CONTAINER_SCROLL_POSITION, containerRef.current.scrollTop.toString());
    sessionStorage.setItem(storageKeys.WINDOW_SCROLL_POSITION, window.scrollY.toString());
  };

  useEffect(() => {
    if (containerRef.current === null) return;
    const targetScrollPosition = sessionStorage.getItem(storageKeys.CONTAINER_SCROLL_POSITION);
    const windowTargetScrollPosition = sessionStorage.getItem(storageKeys.WINDOW_SCROLL_POSITION);

    if (targetScrollPosition && windowTargetScrollPosition) {
      const targetPosition = parseInt(targetScrollPosition, 10);
      const windowTargetPosition = parseInt(windowTargetScrollPosition, 10);

      window.scrollTo({
        top: windowTargetPosition,
        behavior: 'smooth',
      });

      containerRef.current.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      sessionStorage.removeItem(storageKeys.CONTAINER_SCROLL_POSITION);
      sessionStorage.removeItem(storageKeys.WINDOW_SCROLL_POSITION);
    }
  }, []);

  return (
    <>
      <div className="flex gap-4 lg:flex-row lg:mt-0 pb-24 lg:py-0 sm:pt-3 sm:px-3 sm:flex-col-reverse lg:bg-pagePrimary md:bg-componentPrimary">
        <div className="flex flex-col lg:w-2/3 sm:w-full pb-30 lg:pb-0 gap-5">
          <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
          <div ref={containerRef} className="flex flex-col gap-2.5 lg:px-1 md:px-1 h-screen overflow-auto">
            <div className="pt-2 bg-componentPrimary rounded-2xl lg:px-2 lg:pt-8">
              {isAuthenticated && (
                <div className="px-4">
                  <Button onClick={() => setAddASessionDialogOpen(true)} variant="blue" size="lg" className="rounded-full sm:w-full lg:w-fit justify-center" leftIcon={BiPlusCircle}>
                    Add a Session
                  </Button>
                  <Dialog open={addASessionDialogOpen} onOpenChange={(open) => setAddASessionDialogOpen(open)}>
                    {
                      <DialogContent className="lg:w-3/5 lg:h-4/5 overflow-y-auto">
                        <AddScheduleForm
                          isQuickAccess={true}
                          trackId={trackId as string}
                          isFromEventView={true}
                          // updateIsLoading={updateIsLoading}
                          event_space_id={event_space_id as string}
                          setAddASessionDialogOpen={setAddASessionDialogOpen}
                        />
                      </DialogContent>
                    }
                  </Dialog>
                </div>
              )}
              {isLoading ? (
                <Loader />
              ) : (
                <div className="p-0 gap-[10px] flex flex-col rounded-[10px] pb-36 cursor-pointer">
                  {schedules && eventSpace && eventSpace.eventspacelocation && (
                    <>
                      {isMyRSVP
                        ? groupedMyRSVPs &&
                          Object.keys(groupedMyRSVPs).map((date, idx) => {
                            return (
                              <>
                                <div key={idx} className="text-center border-b-2 p-3 mt-10 border-borderPrimary sticky top-[2px] w-full bg-componentPrimary backdrop-blur-lg z-[20]">
                                  <span className="text-lg font-normal w-full">
                                    {new Date(date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                {groupedMyRSVPs[date].map((schedule, idx) => {
                                  return (
                                    schedule.id &&
                                    schedule && (
                                      <UserFacingTrack
                                        key={idx}
                                        scheduleId={schedule.id}
                                        scheduleData={schedule}
                                        onClick={() => {
                                          saveCurrentPosition();
                                          handleItemClick(schedule.id, schedule.track_id as string);
                                        }}
                                        eventSpace={eventSpace}
                                        locationName={getLocationNameById(schedule.location_id, eventSpace.eventspacelocation as LocationType[])}
                                      />
                                    )
                                  );
                                })}
                              </>
                            );
                          })
                        : Object.keys(chosenSchedules).map((date, idx) => {
                            return (
                              <>
                                <div key={idx} className="text-center border-b-2 py-3 mt-10 border-borderPrimary sticky top-[2px] w-full bg-componentPrimary backdrop-blur-lg z-[20]">
                                  <span className="text-lg font-normal w-full">
                                    {new Date(date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                    })}
                                  </span>
                                </div>
                                {chosenSchedules[date].map((schedule, idx) => {
                                  return (
                                    schedule.id && (
                                      <UserFacingTrack
                                        key={idx}
                                        scheduleId={schedule.id}
                                        scheduleData={schedule}
                                        onClick={() => {
                                          saveCurrentPosition();
                                          handleItemClick(schedule.id, schedule.track_id as string);
                                        }}
                                        eventSpace={eventSpace}
                                        locationName={getLocationNameById(schedule.location_id, eventSpace.eventspacelocation as LocationType[])}
                                      />
                                    )
                                  );
                                })}
                              </>
                            );
                          })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:w-1/4 sm:w-full lg:pt-24 lg:flex-col gap-5 lg:fixed lg:right-0 min-w-fit lg:mr-10 lg:mt-[-100px]">
          <Label className="p-3.5 gap-[10px] font-bold text-xl sm:hidden lg:flex pb-4 border-b border-borderPrimary">Sessions: Sort & Filter</Label>
          {isAuthenticated && (
            <div className="flex gap-5 py-5">
              <SwitchButton value={isMyRSVP} onClick={handleShowMyRSVPs} />
              <Label className="text-base">Show my RSVPs</Label>
            </div>
          )}
          <ToggleSwitch isUpcoming={isUpcoming} handleIsUpcoming={handleIsUpcoming} />
          <div className="flex lg:flex-col md:flex-row sm:flex-col w-full p-2.5 md:gap-5 sm:gap-3 text-sm">
            <DropDownMenu values={selectedTracks} multiple={true} header={'Select Tracks'} items={eventSpace.tracks} onItemSelect={handleTrackSelect} />
            <DropDownMenu values={selectedSpaces} multiple={true} header={'Select Space'} items={eventSpace.eventspacelocation as LocationType[]} onItemSelect={handleSpaceSelect} />
            <DropDownMenu values={selectedSpeakers} multiple={true} header={'Select Speaker'} items={speakers} onItemSelect={handleSpeakerSelect} />
            {/* <Listbox as={'div'} className={'w-full relative'} value={selectedTracks} multiple onChange={(newSelectedTracks) => handleTrackSelect(newSelectedTracks)}>
              <Listbox.Button
                className={
                  'relative w-full inline-flex justify-between item-center cursor-pointer bg-trackItemHover border border-borderSecondary py-2 px-2 shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm rounded-xl'
                }
              >
                <div className="flex gap-2 items-center font-semibold pl-2">
                  <span>Select Tracks</span>
                </div>
                <TbChevronDown className="h-5 w-5 text-gray-40 font-extrabold" aria-hidden="true" />
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Listbox.Options className={'absolute right-0 z-10 mt-2 w-full pb-2 bg-componentPrimary origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'}>
                  {eventSpace.tracks.map((item, idx) => (
                    <Listbox.Option key={idx} value={item} className={'block pt-2 px-2 text-sm'}>
                      {({ selected }) => (
                        <>
                          <span
                            className={`relative block truncate rounded-2xl py-2 cursor-pointer px-2 w-full hover:bg-itemHover ${selected
                              ? "font-medium bg-slate-700"
                              : "font-normal"
                              }`}
                          >
                            {item.name.charAt(0).toUpperCase() +
                              item.name.slice(1)}
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox> */}
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  // await queryClient.prefetchQuery('currentEventSpace', () => fetchEventSpaceById(event_space_id));
  const supabase = createPagesServerClient(ctx);
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

  return {
    props: {
      initialSession: session,
      user: session?.user,

      // dehydratedState: dehydrate(queryClient),
    },
  };
};
