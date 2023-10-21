import EventViewHeader from "@/components/eventview/EventViewHeader";
import RenderHTMLString from "@/components/ui/RenderHTMLString";
import Speaker from "@/components/ui/Speaker";
import Button from "@/components/ui/buttons/Button";
import EventDataTime from "@/components/ui/labels/event-data-time";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";

import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { QueryClient, dehydrate, useQuery } from "react-query";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "@/components/ui/Loader";
import EventViewDetailsPanel from "@/components/eventview/EventViewDetailsPanel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  cancelUserRsvpBySchedule,
  checkUserRsvpBySchedule,
  rsvpSchedule,
} from "@/controllers";
import { ScheduleUpdateRequestBody } from "@/types";
import EditScheduleForm from "@/components/commons/EditScheduleForm";
import fetchScheduleById from "@/services/fetchScheduleById";
import { toast } from "@/components/ui/use-toast";

export default function EventViewScheduleDetailsPage() {
  const router = useRouter();
  const { event_space_id, scheduleId, trackId } = router.query;
  const { eventSpace } = useEventDetails();
  const [rsvpUpdated, setRsvpUpdated] = useState(false);
  const [currentSchedule, setCurrentSchedule] =
    useState<ScheduleUpdateRequestBody>();
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [isRsvpFullOnLoad, setIsRsvpFullOnLoad] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const trackItem = eventSpace?.tracks.find(
    (trackItem) => trackItem.id === trackId
  );

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
      if (currentSchedule?.rsvp_amount === 0) {
        toast({
          title: "Error",
          description: "No RSVPs available",
          variant: "destructive",
        });
      } else if (hasRsvpd) {
        const result = await cancelUserRsvpBySchedule(
          scheduleId as string,
          event_space_id as string
        );
        setHasRsvpd(false);
        toast({
          title: "Info",
          description: "RSVPed cancelled",
        });
      } else {
        console.log(scheduleId, "scheduleId");
        const result = await rsvpSchedule(
          scheduleId as string,
          event_space_id as string
        );
        setHasRsvpd(true);
        toast({
          title: "Info",
          description: "RSVPed successfully",
        });
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

  const { data, isError } = useQuery<ScheduleUpdateRequestBody, Error>(
    ["scheduleDetails", scheduleId],
    () => fetchScheduleById(scheduleId as string),
    {
      enabled: !!scheduleId,
      onSuccess: (data) => {
        console.log("schedule details", data);
        const modifiedSchedule = {
          ...data,
          event_type: JSON.parse(data.event_type as string)[0],
          experience_level: JSON.parse(data.experience_level as string)[0],
        };
        setCurrentSchedule(modifiedSchedule);
        setIsLoading(false);
      },
    }
  );

  useEffect(() => {
    if (currentSchedule) {
      if (currentSchedule.rsvp_amount === currentSchedule.current_rsvp_no) {
        setIsRsvpFullOnLoad(true);
      }
      if (currentSchedule.rsvp_amount === 0) {
        setIsRsvpFullOnLoad(false);
      }
    }
  }, [currentSchedule]);

  useEffect(() => {
    checkIfUserHasRsvpd();
  }, []);

  const startTime =
    currentSchedule &&
    new Date(currentSchedule.start_time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  const endTime =
    currentSchedule &&
    new Date(currentSchedule.end_time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

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
              {" "}
              {/* Tracks and Edit Button */}
              <Button
                variant="ghost"
                className="md:text-lg sm:text-base font-bold"
                leftIcon={HiArrowLeft}
                onClick={handleBackToSchedule}
              >
                Back to Sessions
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="quiet"
                    className="rounded-xl"
                    leftIcon={BiEditAlt}
                  >
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:h-4/5 w-full h-screen lg:w-3/5 overflow-y-auto">
                  <EditScheduleForm
                    title="Update"
                    isQuickAccess={true}
                    scheduleId={scheduleId as string}
                    trackId={trackId as string}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 ">
              {" "}
              {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                <span className="text-sm">TRACK/THEME</span>
                <div className="flex items-start">
                  {startTime && endTime && (
                    <EventDataTime startTime={startTime} endTime={endTime} />
                  )}
                </div>
                <h2 className="text-3xl font-bold">{currentSchedule?.name}</h2>
                <div className="flex gap-[6px]">
                  {currentSchedule?.organizers?.map((organizer) => (
                    <Speaker title={organizer.name} />
                  ))}
                </div>
                <div className="flex justify-end">
                  <h3>By: drivenfast</h3>
                </div>
              </div>
              <Button
                variant="primary"
                size="lg"
                className={`rounded-2xl justify-center ${
                  rsvpUpdated ? "animate-rsvp" : ""
                }`}
                leftIcon={BsFillTicketFill}
                onClick={handleRsvpAction}
                disabled={
                  isRsvpFullOnLoad ||
                  currentSchedule?.rsvp_amount === 0 ||
                  (isRsvpFullOnLoad && !hasRsvpd)
                }
              >
                {currentSchedule?.rsvp_amount === 0
                  ? "No Rsvp Available"
                  : hasRsvpd
                  ? "Cancel RSVP"
                  : isRsvpFullOnLoad
                  ? "RSVP Full"
                  : "RSVP Schedule"}
              </Button>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">
              {/* Schedule Description */}
              <h2 className="font-bold">Location</h2>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px] font-bold">
              {/* Schedule Description */}
              {currentSchedule?.description && (
                <RenderHTMLString htmlString={currentSchedule?.description} />
              )}
            </div>
          </div>
        </div>
      </div>
      {eventSpace && currentSchedule?.tags && currentSchedule.organizers && (
        <EventViewDetailsPanel
          eventSpace={eventSpace}
          organizers={currentSchedule.organizers}
          tags={currentSchedule.tags}
        />
      )}
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
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
    },
  };
};
