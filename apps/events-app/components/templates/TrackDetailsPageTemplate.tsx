import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";
import { useEventSpace } from "@/context/EventSpaceContext";
import { TrackUpdateRequestBody } from "@/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiEditAlt, BiPlusCircle } from "react-icons/bi";
import { HiArrowLeft, HiCalendar, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";
import EventViewHeader from "../eventview/EventViewHeader";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "../ui/Loader";
import RenderHTMLString from "../ui/RenderHTMLString";
import EventViewDetailsPanel from "../eventview/EventViewDetailsPanel";

interface ITrackDetailsPageTemplate {
  trackItem: TrackUpdateRequestBody;
}

export default function OnlineTrackDetailsPageTemplate(props: ITrackDetailsPageTemplate) {
  const router = useRouter();
  const { trackItem } = props;
  const { eventSpace, isLoading } = useEventDetails();


  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };
  const handleItemClick = (scheduleName: string, trackId: string | undefined, event_space_id: string) => {
    console.log("TrackDetailsPage Track Id", trackId);
    router.push({
      pathname: "/dashboard/eventview/tracks/track/schedule",
      query: { scheduleName, trackId, event_space_id }
    });
  }

  const handleBackToTracksClick = (event_space_id: string) => {
    router.push({
      pathname: "/dashboard/eventview/tracks",
      query: { event_space_id }
    });
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col w-[1000px]">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="p-5 gap-[30px] max-w-[1000px]">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-xl">
            <div className="flex justify-between">  {/* Tracks and Edit Button */}
              {eventSpace && <Button variant="ghost" className="text-lg font-bold" leftIcon={HiArrowLeft} onClick={() => handleBackToTracksClick(eventSpace?.id)}>Tracks</Button>}
              <Button variant="quiet" className="rounded-xl" leftIcon={BiEditAlt}>Edit</Button>
            </div>
            <div className="flex flex-col gap-[10px] p-5 "> {/* Track Info */}
              <img src={trackItem?.image as string} alt="track image" className=" h-[496px] rounded-[10px]" />
              <div className="flex flex-col gap-[10px] p-2.5"> {/* Tracks Name */}
                <h2 className="font-bold text-2xl">{trackItem.name}</h2>
                <RenderHTMLString htmlString={trackItem.description as string} />
                <span className="rounded-xl flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold justify-start w-[320px] text-lg">
                  <HiCalendar size={25} /> November 29 - November 11
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 w-full">
          <Button variant="blue" size="lg" className="rounded-xl flex justify-center w-full" leftIcon={BiPlusCircle}>
            Add a Schedule
          </Button>
        </div>
        <div className="flex flex-col gap-2.5 p-5 w-full">
          <div className="flex flex-col gap-[10px] overflow-hidden rounded-[10px]">
            {eventSpace &&
              eventSpace?.schedules.map((schedule, idx) => (
                schedule.track_id === trackItem?.id && (
                  <UserFacingTrack key={idx} scheduleData={schedule} onClick={() => handleItemClick(schedule.name, trackItem?.id, eventSpace.id)} />
                )
              ))
            }
          </div>
        </div>
      </div>
      {eventSpace && <EventViewDetailsPanel eventSpace={eventSpace} />}
    </div>
  )
}