import EventViewHeader from '@/components/eventview/EventViewHeader';
import RenderHTMLString from '@/components/ui/RenderHTMLString';
import Speaker from '@/components/ui/Speaker';
import Button from '@/components/ui/buttons/Button';
import { Label } from '@/components/ui/label';
import EventDataDate from '@/components/ui/labels/event-data-date';
import EventDataTime from '@/components/ui/labels/event-data-time';

import { useEventSpace } from '@/context/EventSpaceContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { HiArrowLeft, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "@/components/ui/Loader";
import EventViewDetailsPanel from "@/components/eventview/EventViewDetailsPanel";
import { QueryClient, dehydrate } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
interface IEventLink {
  name: string;
  link: string;
}

export default function EventViewTrackDetailsPage() {
  const { eventSpace, isLoading } = useEventDetails();
  const router = useRouter();
  const { scheduleName, trackId, event_space_id, track_title } = router.query;
  const currentSchedule = eventSpace?.schedules.find((scheduleItem) => scheduleItem.name === scheduleName);
  const trackItem = eventSpace?.tracks.find((trackItem) => trackItem.id === trackId);
  const startTime = currentSchedule && new Date(currentSchedule.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const endTime = currentSchedule && new Date(currentSchedule.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const startDate = currentSchedule && new Date(currentSchedule.start_time).toLocaleDateString('en-US', { month: 'long', day: '2-digit' });
  const endDate = currentSchedule && new Date(currentSchedule.end_time).toLocaleDateString('en-US', { month: 'long', day: '2-digit' });

  const handleBackToTrackClick = (event_space_id: string) => {
    router.push({
      pathname: '/dashboard/eventview/tracks/track',
      query: { trackId, event_space_id },
    });
  };

  const handleEnterSchedule = async (id: string, scheduleTrackId: string) => {
    const scheduleTrackTitle = eventSpace?.tracks.find((trackItem) => trackItem.id === scheduleTrackId)?.name;
    try {
      router.push({
        pathname: `/dashboard/eventview/allschedules/updateschedule`,
        query: {
          event_space_id,
          trackId: scheduleTrackId,
          scheduleId: id,
          track_title: scheduleTrackTitle,
        },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex gap-4 lg:flex-row sm:flex-col">
      <div className="flex flex-col lg:w-[1000px] sm:w-full">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="md:p-5 sm:p-0 gap-[30px] max-w-[1200px] h-full">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-2xl h-full">
            <div className="flex justify-between">
              {' '}
              {/* Tracks and Edit Button */}
              {eventSpace && (
                <Button variant="ghost" className="md:text-lg sm:text-base font-bold" leftIcon={HiArrowLeft} onClick={() => handleBackToTrackClick(eventSpace?.id)}>
                  Back to Track
                </Button>
              )}
              <Button variant="quiet" className="rounded-xl" leftIcon={BiEditAlt} onClick={() => handleEnterSchedule(currentSchedule?.id as string, currentSchedule?.track_id as string)}>
                Edit
              </Button>
            </div>
            <div className="flex flex-col gap-2.5 md:p-2.5 sm:p-0">
              {' '}
              {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                {startTime && endTime && <EventDataTime startTime={startTime} endTime={endTime} />}
                <h2 className="text-2xl font-extrabold">{currentSchedule?.name}</h2>
                <div className="flex gap-[6px]">
                  <Speaker title={'QJ'} />
                  <Speaker title={'Janine Leger'} />
                </div>
                <div>
                  <h3 className="float-right">By: drivenfast</h3>
                </div>
              </div>
              <Button size="lg" variant="quiet" className="rounded-full text-center flex justify-center" leftIcon={BsFillTicketFill}>
                RSVP Schedule
              </Button>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">
              {/* Schedule Description */}
              <h2 className="font-bold">Description</h2>
              <div className="opacity-90">{currentSchedule?.description && <RenderHTMLString height="" htmlString={currentSchedule?.description} />}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:px-10 gap-1 right-0">
        <div className="flex flex-col gap-5 py-5">
          <div className="flex flex-col p-2.5 gap-2.5">
            {trackItem?.image && <img src={trackItem?.image as string} className="lg:h-[200px] rounded-2xl" alt="zuzalu" />}
            {startDate && endDate && <EventDataDate startDate={startDate} endDate={endDate} />}
          </div>
          <div className="flex flex-col p-2.5 gap-2.5 sm:w-[300px] sm:text-sm md:text-base">
            <Label className="text-xl">{trackItem?.name}</Label>
            {trackItem?.description && <RenderHTMLString height="" htmlString={trackItem?.description} />}
          </div>
        </div>
        {eventSpace && <EventViewDetailsPanel eventSpace={eventSpace} />}
      </div>
    </div>
  )
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
