import EventViewHeader from '@/components/eventview/EventViewHeader';
import UserFacingTrack from '@/components/ui/UserFacingTrack';
import Button from '@/components/ui/buttons/Button';
import { ScheduleDetailstype } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { QueryClient } from 'react-query';
import { EventSpaceDetailsType } from '@/types';
import { Loader } from '@/components/ui/Loader';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import AddScheduleForm from '@/components/commons/AddScheduleForm';
import { useGlobalContext } from '@/context/GlobalContext';

import ToggleSwitch from '../commons/ToggleSwitch';

interface ISessionViewPageTemplate {
  event_space_id: string,
  trackId?: string,
  eventSpace: EventSpaceDetailsType;
}

export default function SessionViewPageTemplate({ event_space_id, trackId, eventSpace }: ISessionViewPageTemplate) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<ScheduleDetailstype[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<ScheduleDetailstype[]>([]);
  const lastTrackRef = useRef<HTMLDivElement>(null);
  const [isUpcoming, setIsUpcoming] = useState<boolean>(true);

  const groupedEvents = schedules?.forEach((schedule) => { });
  const { isAuthenticated, user } = useGlobalContext();
  const handleItemClick = (scheduleId: string, trackId?: string) => {
    router.push({
      pathname: `/dashboard/eventview/allschedules/schedule`,
      query: { scheduleId, trackId, event_space_id },
    });
  };

  const updateIsLoading = (newState: boolean) => {
    setIsLoading(newState);
  };


  const fetchSchedules = async () => {
    const response: ScheduleDetailstype[] = await fetchSchedulesByEvenSpaceId(event_space_id as string);
    const filter: ScheduleDetailstype[] = response.filter((schedule) =>
      isUpcoming ?
        (new Date(schedule.date).getTime() > new Date().getTime()) :
        (new Date(schedule.date).getTime() < new Date().getTime())
    )
    setFilteredSchedules(filter);
    setSchedules(response);
    setIsLoading(false);
  };

  const handleIsUpcoming = (newFilter: boolean) => {
    const filter: ScheduleDetailstype[] = schedules.filter((schedule) =>
      newFilter ?
        (new Date(schedule.date).getTime() > new Date().getTime()) :
        (new Date(schedule.date).getTime() < new Date().getTime())
    )
    setFilteredSchedules(filter);
    setIsUpcoming(newFilter);
  }

  useEffect(() => {
    if (isLoading) {
      console.log('isLoading', isLoading);
      fetchSchedules();
    }
  }, [isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log('Load more data');
        }
      },
      { threshold: 1 }
    );

    if (lastTrackRef.current) {
      observer.observe(lastTrackRef.current);
    }

    return () => {
      if (lastTrackRef.current) {
        observer.unobserve(lastTrackRef.current);
      }
    };
  }, [lastTrackRef]);


  const groupedSchedules: Record<string, ScheduleDetailstype[]> = {};
  let isFirstEvent = true;
  filteredSchedules.forEach((schedule) => {
    const date = new Date(schedule.date);
    const end_date = new Date(schedule.end_date);
    const frequency = schedule.schedule_frequency;

    if (frequency === 'everyday' || frequency === 'weekly') {
      isFirstEvent = false;
    }

    do {
      const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      if (!groupedSchedules[formattedDate]) {
        groupedSchedules[formattedDate] = [];
      }

      const newSchedule = { ...schedule, repeating: !isFirstEvent && (frequency === 'everyday' || frequency === 'weekly') } as ScheduleDetailstype & { repeating: boolean };

      groupedSchedules[formattedDate].push(newSchedule);

      if (frequency === 'everyday') {
        date.setDate(date.getDate() + 1);
      } else if (frequency === 'weekly') {
        date.setDate(date.getDate() + 7);
      } else {
        break;
      }
    } while (date <= end_date);
  });

  console.log('Grouped Schedules:', groupedSchedules);
  return (
    <div className="flex gap-4 lg:flex-row mt-5 lg:mt-0 pb-24 lg:pb-0 sm:flex-col-reverse lg:bg-pagePrimary md:bg-componentPrimary">
      <div className="flex flex-col lg:w-2/3 sm:w-full pb-30 lg:pb-0 gap-5">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="flex flex-col gap-2.5 lg:px-1 md:px-1">
          <div className="bg-componentPrimary rounded-2xl lg:px-2 lg:pt-8">
            {isAuthenticated && (
              <div className="px-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="blue" size="lg" className="rounded-full sm:w-full lg:w-fit justify-center" leftIcon={BiPlusCircle}>
                      Add a Session
                    </Button>
                  </DialogTrigger>
                  {
                    <DialogContent className="md:w-3/5 md:h-3/5 overflow-x-auto sm:w-3/4">
                      <AddScheduleForm title={'Add'} isQuickAccess={true} trackId={trackId as string} updateIsLoading={updateIsLoading} event_space_id={event_space_id as string} />
                    </DialogContent>
                  }
                </Dialog>
              </div>
            )}
            {isLoading ? (
              <Loader />
            ) : (
              <div className="p-0 gap-[10px] flex flex-col overflow-hidden rounded-[10px] pb-36">
                {schedules && eventSpace && (
                  <>
                    {Object.keys(groupedSchedules).map((date, idx) => {
                      return (
                        <>
                          <div className="text-center border-b-2 p-3 mt-10 border-borderPrimary">
                            <span className="text-lg font-normal w-full">{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          {groupedSchedules[date].map((schedule, idx) => {
                            return <UserFacingTrack
                              key={idx}
                              scheduleId={schedule.id}
                              scheduleData={schedule}
                              onClick={() => handleItemClick(schedule.id, schedule.track_id as string)}
                            />;
                          })}
                        </>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="lg:w-1/4 sm:w-full flex lg:flex-col gap-5 lg:fixed lg:right-0 min-w-fit lg:mr-10 lg:mt-[-100px]">
            <h2 className="p-3.5 gap-[10px] font-bold text-xl sm:hidden lg:flex">Sessions: Sort & Filter</h2>
            <ToggleSwitch
              isUpcoming={isUpcoming}
              handleIsUpcoming={handleIsUpcoming}
            />
            <div className="flex lg:flex-col md:flex-row sm:flex-col w-full p-2.5 md:gap-5 sm:gap-3 text-sm">
              {/* <DropDownMenu
                data={categoryList}
                header={'Select Categories'}
                headerIcon={SelectCategories}
                multiple={true}
                value={''}
                headerClassName={'rounded-full bg-borderPrimary'}
                optionsClassName={''}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
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
