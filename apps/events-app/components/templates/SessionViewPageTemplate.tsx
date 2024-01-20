import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import EventViewHeader from '@/components/eventview/EventViewHeader';
import UserFacingTrack from '@/components/ui/UserFacingTrack';
import AddScheduleForm from '@/components/commons/AddScheduleForm';
import { LocationType, ScheduleDetailstype } from '@/types';
import { BiPlusCircle } from 'react-icons/bi';
import { Loader } from '@/components/ui/Loader';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '../ui/use-toast';
import { Label } from '../ui/label';
import { DropDownMenu } from '../ui/DropDownMenu';
import SwitchButton from '../ui/buttons/SwitchButton';
import Button from '@/components/ui/buttons/Button';
import ToggleSwitch from '../commons/ToggleSwitch';
// import CalendarGrid from '../commons/CalendarGrid';
import { QueryClient, useQuery } from 'react-query';
import { EventSpaceDetailsType } from '@/types';
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import { useGlobalContext } from '@/context/GlobalContext';
import { filterBySpace, filterBySpeaker, filterByTrack, groupingSchedules, sortByUpcoming, sortGroupedSchedulesByStartTime, stringToDateObject, toTurkeyTime } from '@/utils';
import { fetchAllSpeakers, fetchSchedulesByUserRsvp } from '@/controllers';

interface ISessionViewPageTemplate {
  event_space_id: string;
  trackId?: string;
  eventSpace: EventSpaceDetailsType;
  speakers: any[];
}

type TEventSpaceDetails = EventSpaceDetailsType & {
  eventspacelocation: LocationType[];
  tracks: any[];
};

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

  const storageKeys = {
    CONTAINER_SCROLL_POSITION: 'containerScrollPosition',
    WINDOW_SCROLL_POSITION: 'windowScrollPosition',
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

  const handleItemClick = (scheduleId: string, trackId?: string) => {
    router.push({
      pathname: `/dashboard/eventview/allschedules/schedule`,
      query: { scheduleId, trackId, event_space_id },
    });
  };

  const handleTrackSelect = (newSelectedTracks: any[]) => {
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

  const optimizedSortedSchedules = useMemo(() => {
    let sorted = sortByUpcoming(schedules, isUpcoming);
    sorted = filterByTrack(sorted, selectedTracks);
    sorted = filterBySpace(sorted, selectedSpaces);
    return filterBySpeaker(sorted, selectedSpeakers);
  }, [schedules, isUpcoming, selectedTracks, selectedSpaces, selectedSpeakers]);

  let groupedSchedules: Record<string, ScheduleDetailstype[]> = {};
  groupingSchedules(optimizedSortedSchedules, groupedSchedules);

  // Now, let's categorize them into "past" and "upcoming"
  const pastSchedules: Record<string, ScheduleDetailstype[]> = {};
  const upcomingSchedules: Record<string, ScheduleDetailstype[]> = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  const renderDateHeader = (date: string) => (
    <div className="text-center border-b-2 py-3 mt-10 border-borderPrimary sticky top-[2px] w-full bg-componentPrimary backdrop-blur-lg z-[20]">
      <span className="text-lg font-normal w-full">
        {new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </div>
  );

  const renderSchedule = (schedule: ScheduleDetailstype, eventSpace: TEventSpaceDetails) => (
    <UserFacingTrack
      key={schedule.id}
      scheduleId={schedule.id}
      scheduleData={schedule}
      onClick={() => {
        saveCurrentPosition();
        handleItemClick(schedule.id, schedule.track_id);
      }}
      eventSpace={eventSpace}
      locationName={getLocationNameById(schedule.location_id, eventSpace.eventspacelocation)}
    />
  );

  const renderSchedules = (schedules: Record<string, ScheduleDetailstype[]>, eventSpace: TEventSpaceDetails) => {
    return Object.keys(schedules).map((date) => (
      <React.Fragment key={date}>
        {renderDateHeader(date)}
        {schedules[date].map((schedule) => renderSchedule(schedule, eventSpace))}
      </React.Fragment>
    ));
  };

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
                    <>{isMyRSVP ? renderSchedules(groupedMyRSVPs || {}, eventSpace as TEventSpaceDetails) : renderSchedules(chosenSchedules, eventSpace as TEventSpaceDetails)}</>
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
