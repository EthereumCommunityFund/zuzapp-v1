import EventViewHeader from "@/components/eventview/EventViewHeader";
import RenderHTMLString from "@/components/ui/RenderHTMLString";
import Speaker from "@/components/ui/Speaker";
import Button from "@/components/ui/buttons/Button";
import EventDataTime from "@/components/ui/labels/event-data-time";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { HiArrowLeft } from "react-icons/hi";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { QueryClient, dehydrate, useQuery } from "react-query";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "@/components/ui/Loader";
import EventViewDetailsPanel from "@/components/eventview/EventViewDetailsPanel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TimeAgo from "react-timeago";
import {
  cancelUserRsvpBySchedule,
  checkUserRsvpBySchedule,
  rsvpSchedule,
} from "@/controllers";
import { ScheduleUpdateRequestBody } from "@/types";
import EditScheduleForm from "@/components/commons/EditScheduleForm";
import fetchScheduleById from "@/services/fetchScheduleById";
import { toast } from "@/components/ui/use-toast";
import { deleteScheduleById } from "@/services/deleteSchedule";
import { Label } from "../ui/label";
import { toTurkeyTime } from "@/utils";

interface IEventViewScheduleViewTemplate {
  event_space_id: string;
  scheduleId: string;
  trackId: string;
}

export default function EventViewScheduleViewTemplate({
  event_space_id,
  scheduleId,
  trackId,
}: IEventViewScheduleViewTemplate) {
  const { eventSpace } = useEventDetails();
  const router = useRouter();
  const [rsvpUpdated, setRsvpUpdated] = useState(false);
  const [currentSchedule, setCurrentSchedule] =
    useState<ScheduleUpdateRequestBody>();
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const [isRsvpFullOnLoad, setIsRsvpFullOnLoad] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogs, setShowLogs] = useState(false);

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
      } else {
        const result = await rsvpSchedule(
          scheduleId as string,
          event_space_id as string
        );
        setHasRsvpd(true);
        toast({
          title: "RSVPed successfully",
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

  const mostRecentEditLog =
    currentSchedule?.editlogs?.[currentSchedule?.editlogs?.length - 1];
  const editorUsername = mostRecentEditLog?.user?.username;
  const creatorUsername = currentSchedule?.editlogs[0]?.user?.username;
  const creatorId = currentSchedule?.editlogs[0]?.editor_id;
  const [locatin, setLocation] = useState<string>("");
  useEffect(() => {
    if (currentSchedule) {
      if (currentSchedule.rsvp_amount === currentSchedule.current_rsvp_no) {
        setIsRsvpFullOnLoad(true);
      }
      if (currentSchedule.rsvp_amount === 0) {
        setIsRsvpFullOnLoad(false);
      }
      eventSpace?.eventspacelocation?.forEach((spaceLocation) => {
        if (spaceLocation.id === currentSchedule.location_id)
          setLocation(spaceLocation.name);
      });
    }
  }, [currentSchedule]);

  const handleDeleteSchedule = async () => {
    if (!scheduleId) return;

    setIsLoading(true);
    try {
      await deleteScheduleById(scheduleId as string, event_space_id as string);
      toast({
        title: "session deleted successfully",
      });
      router.push({
        pathname: `/dashboard/eventview/allschedules`,
        query: {
          event_space_id,
        },
      });
    } catch (error) {
      console.error("Error deleting the schedule", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkIfUserHasRsvpd();
  }, []);

  const startTime =
    currentSchedule && toTurkeyTime(currentSchedule.start_time).format("H:mm");

  const endTime =
    currentSchedule && toTurkeyTime(currentSchedule.end_time).format("H:mm");

  if (isLoading) {
    return <Loader />;
  }
  const toggleLogs = () => {
    setShowLogs(!showLogs);
  };

  return (
    <div className="flex gap-4 lg:flex-row sm:flex-col">
      <div className="flex flex-col sm:w-full">
        <EventViewHeader
          imgPath={eventSpace?.image_url as string}
          name={eventSpace?.name as string}
          tagline={eventSpace?.tagline as string}
        />
        <div className="md:p-5 sm:p-0 gap-[30px] max-w-[1200px] h-full">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-2xl lg:w-[750px] lg:overflow-auto">
            {/* flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-2xl */}

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
                    isQuickAccess={true}
                    scheduleId={scheduleId as string}
                    trackId={trackId as string}
                    isFromEventView={true}
                    event_space_id={event_space_id}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 ">
              {" "}
              {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                <span className="text-sm">
                  {trackItem?.name?.toLocaleUpperCase()}
                </span>
                <div className="flex items-start">
                  {startTime && endTime && (
                    <EventDataTime startTime={startTime} endTime={endTime} />
                  )}
                </div>
                <h2 className="text-3xl font-bold">{currentSchedule?.name}</h2>
                <div className="flex flex-wrap gap-[6px] ">
                  {currentSchedule?.organizers?.map((organizer) => (
                    <Speaker title={organizer.name} />
                  ))}
                </div>

                <div>
                  <h3 className="float-right font-medium text-sm ">
                    <span className="text-gray-400">By: </span>
                    <span className="text-gray-300">{creatorUsername}</span>
                  </h3>
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
                  : "RSVP Session"}
              </Button>
            </div>
            {/* <Button variant="red" className="rounded-xl w-fit" onClick={handleDeleteSchedule}>
              Delete
            </Button> */}
            {/* <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">
              <h2 className="font-bold">Location</h2>
              <Label className="text-lg">{locatin}</Label>
            </div> */}
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px] font-bold">
              {currentSchedule?.description && (
                <RenderHTMLString htmlString={currentSchedule?.description} />
              )}
            </div>
            <div className="flex gap-2.5 px-5 items-center">
              <span className="font-medium text-sm text-gray-400">
                Last edited by :
              </span>
              <span className="font-bold">{editorUsername}</span>
              <span className="font-medium text-sm text-gray-400">
                <TimeAgo date={mostRecentEditLog?.edited_at} />
              </span>
            </div>
            {/* <div className="flex flex-col gap-2 px-5 cursor-pointer">
              <span onClick={toggleLogs} className="font-medium text-sm text-gray-400 cursor-pointer">
                {showLogs ? 'Hide' : 'View'} All Edits:{' '}
              </span>
              <div className={`items-center gap-2 ${showLogs ? 'flex' : 'hidden'}`}>
                {currentSchedule?.editlogs.slice(1, -1).map((log: { edited_at: string | number | Date; user: { username: any } }) => {
                  const minutesAgo = <TimeAgo date={log?.edited_at} />;
                  return (
                    <div className="">
                      <span className="font-bold inline-block mr-2">{editorUsername}</span>
                      <span className="font-medium text-sm text-gray-400">
                        <TimeAgo date={mostRecentEditLog?.edited_at} />
                      </span>
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {eventSpace && currentSchedule?.tags && currentSchedule.organizers && (
        <EventViewDetailsPanel
          eventSpace={eventSpace}
          allOrganizers={currentSchedule.organizers}
          tags={currentSchedule.tags}
          schedule={currentSchedule}
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
