import EventViewHeader from "@/components/eventview/EventViewHeader";
import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import RenderHTMLString from "@/components/ui/RenderHTMLString";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { UserGroup } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import EventDataDate from "@/components/ui/labels/event-data-date";
import EventDataTime from "@/components/ui/labels/event-data-time";

import { useEventSpace } from "@/context/EventSpaceContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { HiArrowLeft, HiCalendar, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";

interface IEventLink {
  name: string;
  link: string;
}

export default function EventViewTrackDetailsPage() {
  const { eventSpace } = useEventSpace();
  const router = useRouter();
  const { scheduleName, trackId } = router.query;
  const currentSchedule = eventSpace?.schedules.find((scheduleItem) => (scheduleItem.name === scheduleName));
  const trackItem = eventSpace?.tracks.find((trackItem) => (trackItem.id === trackId));
  const startTime = currentSchedule && new Date(currentSchedule.start_time).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
  const endTime = currentSchedule && new Date(currentSchedule.end_time).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" });
  const startDate = currentSchedule && new Date(currentSchedule.start_time).toLocaleDateString('en-US', { month: 'long', day: '2-digit' });
  const endDate = currentSchedule && new Date(currentSchedule.end_time).toLocaleDateString('en-US', { month: 'long', day: '2-digit' });



  const { setEventSpace } = useEventSpace();

  useEffect(() => {
    console.log("InPersonEventSpace", eventSpace);
    setEventSpace(eventSpace);

  }, [eventSpace])

  return (
    <div className="flex gap-4">
      <div className="flex flex-col w-[1200px]">
        <EventViewHeader imgPath={eventSpace?.image_url as string} name={eventSpace?.name as string} tagline={eventSpace?.tagline as string} />
        <div className="p-5 gap-[30px] max-w-[1200px] h-full">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-2xl h-full">
            <div className="flex justify-between">  {/* Tracks and Edit Button */}
              <Button variant="ghost" className="text-lg font-bold" leftIcon={HiArrowLeft}>Back to Track</Button>
              <Button variant="quiet" className="rounded-xl" leftIcon={BiEditAlt}>Edit</Button>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 "> {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                {startTime && endTime && <EventDataTime startTime={startTime} endTime={endTime} />}
                <h2 className='text-2xl font-extrabold'>{currentSchedule?.name}</h2>
                <div className="flex gap-[6px]">
                  <Speaker title={"QJ"} />
                  <Speaker title={"Janine Leger"} />
                </div>
                <div>
                  <h3 className="float-right">By: drivenfast</h3>
                </div>
              </div>
              <Button size="lg" variant="quiet" className="rounded-full text-center flex justify-center" leftIcon={BsFillTicketFill}>RSVP Schedule</Button>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">{/* Schedule Description */}
              <h2 className="font-bold">Description</h2>
              <div className="opacity-90">
                {currentSchedule?.description && <RenderHTMLString height="" htmlString={currentSchedule?.description} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-10 gap-1 right-0">
        <div className="flex flex-col gap-5 py-5">
          <div className="flex flex-col p-2.5 gap-2.5">
            {trackItem?.image && <img src={trackItem?.image as string} className="h-[200px] rounded-2xl" alt="zuzalu" />}
            {startDate && endDate && <EventDataDate startDate={startDate} endDate={endDate} />}
          </div>
          <div className="flex flex-col p-2.5 gap-2.5 w-[300px]">
            <Label className="text-xl">{trackItem?.name}</Label>
            {trackItem?.description && <RenderHTMLString height="" htmlString={trackItem?.description} />}
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-3">
            <h2 className="font-bold p-3.5 border-b border-b-background text-xl">Details</h2>
            <div className="flex gap-2 items-center">
              <Label className="opacity-60">Format: </Label>
              <Label className="opacity-70 font-bold text-base">{eventSpace?.format.toUpperCase()}</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="opacity-60">Type: </Label>
              <Label className="opacity-70 font-bold text-base">{eventSpace?.event_type?.join(', ')}</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Label className="opacity-60">Expereicne Level: </Label>
              <Label className="opacity-70 font-bold text-base">{eventSpace?.experience_level}</Label>
            </div>
          </div>
          <div className="pb-10 gap-2.5">
            <div className="flex flex-col gap-5  rounded-[10px]">
              <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                <div className="flex gap-2.5 items-center">
                  <HiCog className="text-2xl" />
                  <h2>Organizers</h2>
                </div>
                <div className="flex gap-[6px]">
                  <Speaker title="QJ" />
                  <Speaker title="Janine Leger" />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                  <div className="flex gap-2.5 items-center">
                    <HiMicrophone className="text-2xl" />
                    <h2>Speakers</h2>
                  </div>
                  <div className="flex gap-[6px]">
                    <Speaker title="Avery Longname" />
                    <Speaker title="Janine Leger" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col border-b border-b-background pb-5 gap-5">
                  <div className="flex gap-2.5 items-center">
                    <HiTag className="text-2xl" />
                    <h2>Tags</h2>
                  </div>
                  <div className="flex gap-2.5">
                    <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">Tag2</Label>
                    <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">Tag2</Label>
                    <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">Tag2</Label>
                    <Label className="rounded-xl opacity-70 bg-itemBgPrimary p-2 text-lg">Tag2</Label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col pb-2.5 gap-5">
                <div className="flex gap-2.5 items-center">
                  <HiLocationMarker className="text-2xl" />
                  <h2>Location</h2>
                </div>
                <div className="flex gap-2.5">
                  <img src="/images/1.png" width={100} height={50} alt="333" />
                  <div className="flex flex-col gap-[6px]">
                    <h2 className="font-bold">Soho House Istanbul</h2>
                    <Label className="opacity-70">Beyoglu, Istanbul, Turkey</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex p-2.5 text-xl items-center gap-3">
              <HiUserGroup className="text-2xl" />
              <span>14 going</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}