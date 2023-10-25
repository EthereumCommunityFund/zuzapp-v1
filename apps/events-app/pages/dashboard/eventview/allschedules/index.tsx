import EventViewHeader from '@/components/eventview/EventViewHeader';
import TrackItemCard from '@/components/tracks/TrackItemCard';
import MyDropdown from '@/components/ui/DropDown';
import { DropDownMenu } from '@/components/ui/DropDownMenu';
import Pagination from '@/components/ui/Pagination';
import UserFacingTrack from '@/components/ui/UserFacingTrack';
import Button from '@/components/ui/buttons/Button';
import { Calendar, SelectCategories, SelectLocation } from '@/components/ui/icons';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import { DropDownMenuItemType, ScheduleDetailstype } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BiLeftArrow, BiPlusCircle } from 'react-icons/bi';
import { QueryClient, dehydrate, useQuery } from 'react-query';
import { EventSpaceDetailsType } from '@/types';
import useEventDetails from '@/hooks/useCurrentEventSpace';
import { Loader } from '@/components/ui/Loader';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ScheduleEditForm from '@/components/commons/AddScheduleForm';
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import EditScheduleForm from '@/components/commons/EditScheduleForm';
import AddScheduleForm from '@/components/commons/AddScheduleForm';
import { useGlobalContext } from '@/context/GlobalContext';
import useTrackDetails from '@/hooks/useTrackDetails';

const categoryList: DropDownMenuItemType[] = [
  {
    name: 'Network States',
  },
  {
    name: 'Character Cities',
  },
  {
    name: 'Coordinations',
  },
];

export default function EventViewTracksAlleSchedulesPage() {
  const router = useRouter();
  const { event_space_id, trackId, track_title } = router.query;
  const { eventSpace, isLoading: isLoadingSpace } = useEventDetails();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<ScheduleDetailstype[]>();
  const lastTrackRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 7;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalSchedules = schedules ? schedules.length : 0;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalSchedules);
  const currentSchedules = schedules ? schedules.slice(startIndex, endIndex) : [];
  const { trackDetails, isLoading: trackLoader } = useTrackDetails();

  const { isAuthenticated, user } = useGlobalContext();
  console.log(isLoading, 'is loading');

  const handleItemClick = (scheduleId: string, trackId?: string) => {
    router.push({
      pathname: `/dashboard/eventview/allschedules/schedule`,
      query: { scheduleId, trackId, event_space_id },
    });
  };

  const updateIsLoading = (newState: boolean) => {
    setIsLoading(newState);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const fetchSchedules = async () => {
    const response = await fetchSchedulesByEvenSpaceId(event_space_id as string);
    setSchedules(response);
    setIsLoading(false);
  };

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

  console.log(schedules, 'schedules-from-allschedules');
  return (
    <div className="flex gap-4 lg:flex-row mt-5 lg:mt-0 pb-24 lg:pb-0 sm:flex-col-reverse lg:bg-pagePrimary md:bg-componentPrimary">
      <div className="flex flex-col lg:w-2/3 sm:w-full pb-30 lg:pb-0 gap-5">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="flex flex-col gap-2.5 lg:px-9 md:px-5">
          <div className="bg-componentPrimary rounded-2xl lg:px-5 lg:pt-8">
            {isAuthenticated && (
              <div>
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
              <div className=" p-2.5 gap-[10px] flex flex-col overflow-hidden rounded-[10px] pb-36">
                {schedules && eventSpace && (
                  <>
                    {currentSchedules.map((schedule, idx) => (
                      <UserFacingTrack key={idx} scheduleId={schedule.id} scheduleData={schedule} onClick={() => handleItemClick(schedule.id, schedule.track_id as string)} />
                    ))}
                    {totalSchedules > ITEMS_PER_PAGE && <Pagination currentPage={currentPage} totalItems={schedules.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={handlePageChange} />}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="lg:w-1/4 sm:w-full flex lg:flex-col gap-5 lg:fixed lg:right-0 min-w-fit lg:mr-10 lg:mt-[-100px]">
            <h2 className="p-3.5 gap-[10px] font-bold text-xl sm:hidden lg:flex">Schedules: Sort & Filter</h2>
            <div className="flex lg:flex-col md:flex-row sm:flex-col w-full p-2.5 md:gap-5 sm:gap-3 text-sm">
              <DropDownMenu
                data={categoryList}
                header={'Select Categories'}
                headerIcon={SelectCategories}
                multiple={true}
                value={''}
                headerClassName={'rounded-full bg-borderPrimary'}
                optionsClassName={''}
              />
              <DropDownMenu data={categoryList} header={'Select Dates'} headerIcon={Calendar} multiple={true} value={''} headerClassName={'rounded-full bg-borderPrimary'} optionsClassName={''} />
              <DropDownMenu
                data={categoryList}
                header={'Select Location'}
                headerIcon={SelectLocation}
                multiple={true}
                value={''}
                headerClassName={'rounded-full bg-borderPrimary'}
                optionsClassName={''}
              />
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
