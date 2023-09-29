import { TbTicket } from "react-icons/tb";
import Speaker from "./Speaker";
import EventDataDate from "./labels/event-data-date";
import { ScheduleUpdateRequestBody } from "@/types";

interface IUserFacingTrack {
  scheduleData: ScheduleUpdateRequestBody
  onClick: () => void;
}

export default function UserFacingTrack(props: IUserFacingTrack) {
  const { scheduleData, onClick } = props;

  return (
    <div onClick={onClick}>
      <div className="text-center border-b-2 p-5 border-stone-800">
        <span className="text-lg font-bold w-full">{new Date(scheduleData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="flex flex-col p-4 rounded-2xl bg-componentPrimary">
        <div className="flex justify-between">
          <div>
            <div className="rounded-[10px] p-2.5  text-center bg-trackDateColor">
              <h2 className="font-bold text-xl">29</h2>
              <b className="font-bold text-xl">Oct.</b>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 w-3/4">
            {/* <div className="flex gap-2.5">
            <span>RECURRING</span>
            <span>TRACK/THEME</span>
          </div> */}
            <span className="font-bold text-xl">{scheduleData.name}</span>
            <div className="flex gap-2.5">
              <EventDataDate startDate="November 8" endDate="November 29" />
            </div>
            <div className="flex gap-[3px]">
              <Speaker title="Janine Leger" />
              <Speaker title="QJ" />
            </div>

          </div>
          <div>
            <div className="bg-trackDateColor p-1 rounded-xl">
              <TbTicket className="text-[40px] opacity-70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}