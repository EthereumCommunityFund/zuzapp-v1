import EventViewHeader from "@/components/eventview/EventViewHeader";
import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import RenderHTMLString from "@/components/ui/RenderHTMLString";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";
import EventDataDate from "@/components/ui/labels/event-data-date";
import EventDataTime from "@/components/ui/labels/event-data-time";
import EventData from "@/components/ui/labels/event-data-time";
import { useEventSpace } from "@/context/EventSpaceContext";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import {
  HiArrowLeft,

} from "react-icons/hi";

import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { QueryClient, dehydrate, useQuery } from "react-query";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "@/components/ui/Loader";
import EventViewDetailsPanel from "@/components/eventview/EventViewDetailsPanel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UpdateSchedulePage from "../../events/space/tracks/schedules/updateSchedule";
import ScheduleEditForm from "@/components/commons/ScheduleEditForm";
import {
  cancelUserRsvpBySchedule,
  checkUserRsvpBySchedule,
  rsvpSchedule,
} from "@/controllers";
import { ScheduleUpdateRequestBody } from "@/types";

export default function EventViewScheduleDetailsPage() {
  const router = useRouter();
  const { event_space_id } = router.query;
  const { eventSpace, isLoading } = useEventDetails();
  const [rsvpUpdated, setRsvpUpdated] = useState(false);
  const { scheduleName, scheduleId, trackId } = router.query;
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const currentSchedule = eventSpace?.schedules.find((scheduleItem) => scheduleItem.name === scheduleName);
  const trackItem = eventSpace?.tracks.find((trackItem) => trackItem.id === trackId);
  const startTime =
    currentSchedule &&
    new Date(currentSchedule.start_time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  const endTime =
    currentSchedule &&
    new Date(currentSchedule.end_time).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });


  const handleBackToSchedule = () => {
    router.push({
      pathname: `/dashboard/eventview/allschedules`,
      query: {
        event_space_id,
      },
    });
  };

  const handleRsvpAction = async () => {
    try {
      if (hasRsvpd) {
        const result = await cancelUserRsvpBySchedule(
          scheduleId as string,
          event_space_id as string
        );
        console.log(result, "cancelrsvp");
        setHasRsvpd(false);
      } else {
        console.log(scheduleId, "scheduleId");
        const result = await rsvpSchedule(
          scheduleId as string,
          event_space_id as string
        );
        console.log(result, "rsvp updated");
        setHasRsvpd(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfUserHasRsvpd = async () => {
    try {
      const result = await checkUserRsvpBySchedule(
        scheduleId as string,
        event_space_id as string
      );
      const hasRsvp = result?.data?.hasRSVPed;
      setHasRsvpd(hasRsvp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnterSchedule = async (id: string, scheduleTrackId: string) => {
    const scheduleTrackTitle = eventSpace?.tracks.find(
      (trackItem) => trackItem.id === scheduleTrackId
    )?.name;
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
        <EventViewHeader
          imgPath={eventSpace?.image_url as string}
          name={eventSpace?.name as string}
          tagline={eventSpace?.tagline as string}
        />
        <div className="md:p-5 sm:p-0 gap-[30px] max-w-[1200px] h-full">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-2xl">
            <div className="flex justify-between">
              {' '}
              {/* Tracks and Edit Button */}
              <Button variant="ghost" className="md:text-lg sm:text-base font-bold" leftIcon={HiArrowLeft} onClick={handleBackToSchedule}>
                Back to Schedules
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="quiet" className="rounded-xl" leftIcon={BiEditAlt}>
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-3/5 lg:w-3/5 overflow-y-auto">
                  <ScheduleEditForm
                    title='Update Schedule'
                    isFromAllSchedules={true}
                    scheduleData={currentSchedule as ScheduleUpdateRequestBody} />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 ">
              {' '}
              {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                <span className="text-sm">TRACK/THEME</span>
                <div className="flex items-start">{startTime && endTime && <EventDataTime startTime={startTime} endTime={endTime} />}</div>
                <h2 className="text-3xl font-bold">{currentSchedule?.name}</h2>
                <div className="flex gap-[6px]">
                  {
                    currentSchedule?.organizers?.map((organizer) => (
                      <Speaker title={organizer.name} />
                    ))
                  }
                </div >
                <div className="flex justify-end">
                  <h3>By: drivenfast</h3>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className={`rounded-2xl justify-center ${rsvpUpdated ? "animate-rsvp" : ""
                  }`}
                leftIcon={BsFillTicketFill}
                onClick={handleRsvpAction}
              >
                {hasRsvpd ? "Cancel RSVP" : "RSVP Schedule"}
              </Button>
            </div >
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">
              {/* Schedule Description */}
              <h2 className="font-bold">Location</h2>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px] font-bold">
              {/* Schedule Description */}
              {currentSchedule?.description && <RenderHTMLString htmlString={currentSchedule?.description} />}
            </div>
          </div >
        </div >
      </div >
      {eventSpace && <EventViewDetailsPanel eventSpace={eventSpace} />}
    </div >
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
