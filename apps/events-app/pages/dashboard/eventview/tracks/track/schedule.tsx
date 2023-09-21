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
              <Button variant="ghost" leftIcon={BiLeftArrow}>Back to Track</Button>
              <Button variant="light-dark" leftIcon={BiEditAlt}>Edit</Button>
            </div>
            <div className="flex flex-col gap-2.5 p-2.5 "> {/* Schedule Info */}
              <div className="flex flex-col gap-2.5 p-5">
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
                <p>Pleases join and help curate the town hall content.

                  Add anything you'd like to see discussed under the community section in the slides: https://docs.google.com/presentation/d/1HnwWa4RQLigSJQHb4UgcQJunwUAzQPYe2_ms64s2ONs/edit#slide=id.g22f11e770b1_0_0Join us!

                  Click the following link to join the meeting from your computer: https://meet.jit.si/LegitimateFacultiesCycleEven

                  =====

                  Just want to dial in on your phone? Call one of the following numbers:Australia: +61.8.7150.1136Brazil: +55.21.3500.0112Canada: +1.437.538.3987France: +33.1.87.21.0005Japan: +81.3.4510.2372Netherlands: +31.85.208.1541Spain: +34.932.205.409Switzerland: +41.61.588.0496UK: +44.203.885.2179US: +1.512.647.1431 Dial your meeting ID: '2227047350' and you will be connected!</p>
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