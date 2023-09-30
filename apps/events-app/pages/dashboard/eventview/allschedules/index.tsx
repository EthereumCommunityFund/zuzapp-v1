import TrackItemCard from "@/components/tracks/TrackItemCard";
import MyDropdown from "@/components/ui/DropDown";
import Pagination from "@/components/ui/Pagination";
import UserFacingTrack from "@/components/ui/UserFacingTrack";
import Button from "@/components/ui/buttons/Button";
import { useEventSpace } from "@/context/EventSpaceContext";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiLeftArrow, BiPlusCircle } from "react-icons/bi";

export default function EventViewTracksAlleSchedulesPage() {
  const router = useRouter();
  const { eventSpace } = useEventSpace();

  const handleItemClick = (scheduleName: string, trackId?: string) => {
    router.push({
      pathname: "/dashboard/eventview/allschedules/schedule",
      query: { scheduleName, trackId }
    });
  }
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
        <div className="flex flex-col gap-2.5 p-[30px]">
          <div>
            <Button variant="blue" size="lg" className="rounded-xl" leftIcon={BiPlusCircle}>
              Add a Schedule
            </Button>
          </div>
          <div className=" p-2.5 gap-[10px] overflow-hidden rounded-[10px]">
            {
              eventSpace?.schedules.map((schedule) => (
                <UserFacingTrack onClick={() => handleItemClick(schedule.name, schedule.track_id)} scheduleData={schedule} />
              ))
            }
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 px-5 py-2.5">
        <h2 className="p-3.5 gap-[10px] font-bold border">Schedules: Sort & Filter</h2>
        <div className="p-2.5 gap-5 ">
          <MyDropdown placeholder={""} options={[]} className={"rounded-full text-opacity-70 bg-componentPrimary"} />
          <MyDropdown placeholder={""} options={[]} className={"rounded-full text-opacity-70 bg-componentPrimary"} />
          <MyDropdown placeholder={""} options={[]} className={"rounded-full text-opacity-70 bg-componentPrimary	"} />
        </div>
      </div>
    </div>
  )
}