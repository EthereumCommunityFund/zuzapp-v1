import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { Label } from "@/components/ui/label";
import EventDataDate from "@/components/ui/labels/event-data-date";
import EventData from "@/components/ui/labels/event-data-time";
import { useState } from "react";
import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { HiArrowLeft, HiCalendar, HiCog, HiLocationMarker, HiMicrophone, HiTag, HiUserGroup } from "react-icons/hi";

export default function EventViewScheduleDetailsPage() {

  return (
    <div className="flex gap-4">
      <div className="flex flex-col w-[1000px]">
        <div className="flex px-2.5 rounded-full gap-[10px] h-[60px] justify-between items-center">
          <img src="/images/1.png" width={100} alt="event" />
          <div className="flex flex-col gap-2 w-3/4">
            <h2 className="font-bold text-3xl">ZuConnect</h2>
            <span className="font-semibold opacity-70">A Popup Village of Innovation in the Heart of Istanbul</span>
          </div>
          <Button className="rounded-[20px] text-base w-[150px] h-10 items-center">
            <span className="mx-auto" >Apply to Event</span>
          </Button>
        </div>
        <div className="p-5 gap-[30px] max-w-[1000px]">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary rounded-2xl">
            <div className="flex justify-between">  {/* Tracks and Edit Button */}
              <Button variant="ghost" className="opacity-70 text-lg" leftIcon={HiArrowLeft}>Back to Schedules</Button>
              <Button variant="quiet" className="rounded-xl bg-componentPrimary text-lg" leftIcon={BiEditAlt}>Edit</Button>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 "> {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                <span className="text-sm">TRACK/THEME</span>
                <div className="flex items-start">
                  <EventData startTime={"00:00 AM"} endTime={"00:00 PM"} />
                </div>
                <h2 className='text-3xl font-bold'>Opening Meetup (some game to get to know the coworking space + hotels)</h2>
                <div className="flex gap-[6px]">
                  <Speaker title={"QJ"} />
                  <Speaker title={"Janine Leger"} />
                </div>
                <div className="flex justify-end">
                  <h3>By: drivenfast</h3>
                </div>
              </div>
              <Button variant="quiet" size="lg" className="rounded-2xl justify-center" leftIcon={BsFillTicketFill}>RSVP Schedule</Button>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">{/* Schedule Description */}
              <h2 className="font-bold">Location</h2>
              <div className="opacity-90">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col pt-5 pb-10 gap-5">
        <div className="flex flex-col gap-3">
          <h2 className="font-bold p-3.5 border-b border-b-background text-xl">Details</h2>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Format: </Label>
            <Label className="opacity-70 font-bold text-base">In-Person</Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Type: </Label>
            <Label className="opacity-70 font-bold text-base">Meetup</Label>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="opacity-60">Expereicne Level: </Label>
            <Label className="opacity-70 font-bold text-base">Greenies</Label>
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
  )
}