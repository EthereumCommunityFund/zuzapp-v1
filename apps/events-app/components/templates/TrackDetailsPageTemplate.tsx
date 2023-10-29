import TrackItemCard from '@/components/tracks/TrackItemCard';
import MyDropdown from '@/components/ui/DropDown';
import Pagination from '@/components/ui/Pagination';
import Speaker from '@/components/ui/Speaker';
import UserFacingTrack from '@/components/ui/UserFacingTrack';
import Button from '@/components/ui/buttons/Button';
import { Label } from '@/components/ui/label';
import { useEventSpace } from '@/context/EventSpaceContext';
import { OrganizerType, ScheduleCreateRequestBody, ScheduleDetailstype, ScheduleUpdateRequestBody, TrackType, TrackUpdateRequestBody } from '@/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiEditAlt, BiPlusCircle } from 'react-icons/bi';
import { HiArrowLeft, HiCalendar, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from 'react-icons/hi';
import EventViewHeader from '../eventview/EventViewHeader';
import useEventDetails from '@/hooks/useCurrentEventSpace';
import { Loader } from '../ui/Loader';
import RenderHTMLString from '../ui/RenderHTMLString';
import EventViewDetailsPanel from '../eventview/EventViewDetailsPanel';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Update from '@/pages/dashboard/events/space/tracks/update';
import EventViewTrackUpdate from '../eventview/EventViewTrackUpdate';
import AddSchedulePage from '@/pages/dashboard/events/space/tracks/schedules/addschedule';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { QueryClient, dehydrate } from 'react-query';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';

import AddScheduleForm from '../commons/AddScheduleForm';
import fetchSchedulesByTrackId from '@/services/fetchSchedulesByTrackId';
import React from 'react';
import { fetchAllSpeakers } from '@/controllers';
import { DialogOverlay } from '@radix-ui/react-dialog';
import { useGlobalContext } from '@/context/GlobalContext';

interface ITrackDetailsPageTemplate {
  trackItem: TrackType;
  organizers: [];
}

export default function TrackDetailsPageTemplate(props: any) {
  const router = useRouter();
  const { trackItem } = props;
  const { eventSpace } = useEventDetails();
  const { event_space_id, trackId, track_title } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<ScheduleDetailstype[]>();
  const [organizers, setOrganizers] = useState<OrganizerType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };
  const totalSchedules = schedules ? schedules.length : 0;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalSchedules);
  const currentSchedules = schedules ? schedules.slice(startIndex, endIndex) : [];

  const updateIsLoading = (newState: boolean) => {
    setIsLoading(newState);
  };

  const { isAuthenticated, user } = useGlobalContext();
  const handleItemClick = (scheduleName: string, trackId: string | undefined, event_space_id: string, scheduleId: string) => {
    router.push({
      pathname: '/dashboard/eventview/tracks/track/schedule',
      query: { scheduleName, trackId, event_space_id, scheduleId },
    });
  };

  const handleBackToTracksClick = (event_space_id: string) => {
    router.push({
      pathname: '/dashboard/eventview/tracks',
      query: { event_space_id },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const fetchSchedules = async () => {
    const response: ScheduleDetailstype[] = await fetchSchedulesByTrackId(trackId as string);
    const allTagsSet: Set<string> = new Set();
    const allOrganizersSet: Set<OrganizerType> = new Set();

    response.forEach((schedule: ScheduleDetailstype) => {
      if (schedule.tags) {
        schedule.tags.forEach((tag) => allTagsSet.add(tag));
      }
      if (schedule.organizers) {
        schedule.organizers.forEach((organizer: OrganizerType) => allOrganizersSet.add(organizer));
      }
    });

    const allTags: string[] = Array.from(allTagsSet);
    const allOrganizers: OrganizerType[] = Array.from(allOrganizersSet).filter((organizer, index, self) => index === self.findIndex((o) => o.role === organizer.role && o.name === organizer.name));
    setTags(allTags);
    setOrganizers(allOrganizers);
    setSchedules(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      fetchSchedules();
    }
  }, [isLoading]);

  return (
    <div className="flex gap-4 lg:flex-row sm:flex-col">
      <div className="flex flex-col lg:min-w-[66.67%] lg:max-w-[66.67%] w-full">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="md:p-5 sm:p-0 gap-[30px] md:w-full">
          <div className="flex flex-col gap-[10px] px-2.5 py-5 bg-componentPrimary rounded-xl">
            <div className="flex justify-between">
              {' '}
              {/* Tracks and Edit Button */}
              {eventSpace && (
                <Button variant="ghost" className="text-lg font-bold" leftIcon={HiArrowLeft} onClick={() => handleBackToTracksClick(eventSpace?.id)}>
                  Tracks
                </Button>
              )}
              {isAuthenticated && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="quiet" className="rounded-xl text-lg font-bold" leftIcon={BiEditAlt}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="lg:w-3/5 lg:h-4/5 overflow-x-auto">
                    <DialogHeader>
                      <Label className="text-2xl font-bold">Edit Track</Label>
                    </DialogHeader>
                    <EventViewTrackUpdate className="text-white" />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex flex-col gap-[10px] p-5 ">
              {' '}
              {/* Track Info */}
              <img src={trackItem?.image as string} alt="track image" className="lg:h-[496px] md:h-full rounded-[10px]" />
              <div className="flex flex-col gap-[10px] p-2.5">
                {' '}
                {/* Tracks Name */}
                <h2 className="font-bold text-2xl">{trackItem.name}</h2>
                <RenderHTMLString htmlString={trackItem.description as string} />
                <span className="rounded-xl flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold justify-start md:w-[320px] md:text-lg sm:w-fit">
                  <HiCalendar size={25} /> October 28 - November 11
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 w-full">
          {isAuthenticated && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="blue" size="lg" className="rounded-xl flex justify-center w-full" leftIcon={BiPlusCircle}>
                  Add a Session
                </Button>
              </DialogTrigger>
              <DialogContent className="lg:w-3/5 lg:h-4/5 overflow-y-auto">
                <AddScheduleForm title={'Add'} isQuickAccess={false} trackId={trackId as string} updateIsLoading={updateIsLoading} event_space_id={event_space_id as string} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col gap-2.5 p-5 w-full">
            <div className="flex flex-col gap-[10px] overflow-hidden rounded-[10px]">
              {schedules && eventSpace && (
                <>
                  {currentSchedules.map(
                    (schedule, idx) =>
                      schedule.track_id === trackItem?.id && (
                        <UserFacingTrack key={idx} scheduleData={schedule} onClick={() => handleItemClick(schedule.name, trackItem?.id, eventSpace.id, schedule.id)} />
                      )
                  )}
                  {totalSchedules > ITEMS_PER_PAGE && <Pagination currentPage={currentPage} totalItems={schedules.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={handlePageChange} />}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {eventSpace && <EventViewDetailsPanel eventSpace={eventSpace} allOrganizers={organizers} tags={tags} />}
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  await queryClient.prefetchQuery('currentEventSpace', () => fetchEventSpaceById(event_space_id));
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

  // get profile from session
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
