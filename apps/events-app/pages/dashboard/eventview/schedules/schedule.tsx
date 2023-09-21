import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Speaker from "@/components/ui/Speaker";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import EventDataDate from "@/components/ui/labels/event-data-date";
import EventData from "@/components/ui/labels/event-data-time";
import { useState } from "react";
import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
import { BsFillTicketFill } from "react-icons/bs";
import { HiCalendar } from "react-icons/hi";

export default function EventViewTrackDetailsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <>
      <div className="flex flex-col w-[1000px]">
        <div className="px-2.5 py-2.5 rounded-full gap-[10px]">
          <img src="" alt="event" />
          <div className="flex flex-col">
            <h2 className="font-bold">ZuConnect</h2>
            <span className="font-semibold">A Popup Village of Innovation in the Heart of Istanbul</span>
          </div>
          <Button>Apply to Event</Button>
        </div>
        <div className="p-5 gap-[30px] max-w-[1000px]">
          <div className="flex flex-col gap-[10px] p-2.5 bg-componentPrimary">
            <div className="flex justify-between">  {/* Tracks and Edit Button */}
              <Button variant="ghost" leftIcon={BiLeftArrow}>Back to Schedules</Button>
              <Button variant="light-dark" leftIcon={BiEditAlt}>Edit</Button>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 "> {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
                <span>TRACK/THEME</span>
                <EventData startTime={"00:00 AM"} endTime={"00:00 PM"} />
                <h2 className='text-2xl font-extrabold'>Opening Meetup (some game to get to know the coworking space + hotels)</h2>
                <div className="flex gap-[6px]">
                  <Speaker title={"QJ"} />
                  <Speaker title={"Janine Leger"} />
                </div>
                <h3>By: drivenfast</h3>
              </div>
              <Button variant="light-dark" leftIcon={BsFillTicketFill}>RSVP Schedule</Button>
            </div>
            <div className="flex flex-col gap-2.5 px-5 pt-5 pb-[60px]">{/* Schedule Description */}
              <h2 className="font-bold">Description</h2>
              <div className="opacity-90">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 py-5">
        <div className="flex flex-col p-2.5 gap-2.5">
          <img src="" alt="zuzalu" />
          <EventDataDate startDate={"Nov 29"} endDate={"Nov 11"} />
        </div>
        {
          <>
            <UserFacingTrack />
            <UserFacingTrack />
            <UserFacingTrack />
          </>
        }
      </div>
    </>
  )
}