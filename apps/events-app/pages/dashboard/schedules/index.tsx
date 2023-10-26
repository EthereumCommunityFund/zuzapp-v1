import EventViewHeader from '@/components/eventview/EventViewHeader';
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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import fetchSchedulesByEvenSpaceId from '@/services/fetchScheduleByEventSpace';
import EditScheduleForm from '@/components/commons/EditScheduleForm';
import AddScheduleForm from '@/components/commons/AddScheduleForm';
import SessionViewPageTemplate from '@/components/templates/SessionViewPageTemplate';

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

  const event_space_id = '873f2ae3-bcab-4a30-8b99-cb5e011a9db0';
  const [eventSpace, setEventSpace] = useState<EventSpaceDetailsType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<ScheduleDetailstype[]>();
  const lastTrackRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 7;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalSchedules = schedules ? schedules.length : 0;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalSchedules);
  const currentSchedules = schedules ? schedules.slice(startIndex, endIndex) : [];

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
    const curEventSpace = await fetchEventSpaceById(event_space_id);
    setEventSpace(curEventSpace);
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

  return (
    <>
      {
        eventSpace &&
        <SessionViewPageTemplate
          event_space_id={event_space_id}
          eventSpace={eventSpace}
        />
      }
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
