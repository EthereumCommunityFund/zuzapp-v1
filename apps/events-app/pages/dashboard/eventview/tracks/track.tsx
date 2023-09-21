import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import Speaker from "@/components/ui/Speaker";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import { BiEditAlt, BiLeftArrow } from "react-icons/bi";
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
              <Button variant="ghost" leftIcon={BiLeftArrow}>Tracks</Button>
              <Button variant="light-dark" leftIcon={BiEditAlt}>Edit</Button>
            </div>
            <div className="flex flex-col gap-[10px] p-5 "> {/* Track Info */}
              <img src="" alt="track image" className=" h-[496px] rounded-[10px]" />
              <div className="flex flex-col gap-[10px] p-2.5"> {/* Tracks Name */}
                <h2 className="font-bold">Track Name</h2>
                <p className="text-opacity-70">Public goods in Web3 refer to digital assets or resources that are openly accessible and available to all users on a blockchain network. They are typically funded by the community and are designed to benefit the entire ...</p>
                <span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
                  <HiCalendar /> November 29 - November 11
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 px-5 py-2.5">
        <h2 className="p-3.5 gap-[10px] font-bold border">Track Details</h2>
        <div className="flex flex-col gap-[30px] p-3.5">
          <div className="flex flex-col gap-5"> {/* Organizers */}
            <span>Organizers</span>
            <div className="flex gap-[6px]">
              {
                <>
                  <Speaker title="QJ" />
                  <Speaker title="Janine Leger" />
                </>
              }
            </div>
          </div>
          <div className="flex flex-col gap-5"> {/* Speakers */}
            <span>Speakers</span>
            <div className="flex flex-col gap-[6px]">
              {
                <>
                  <Speaker title="Janine Leger" />
                  <Speaker title="Janine Leger" />
                  <Speaker title="Janine Leger" />
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}