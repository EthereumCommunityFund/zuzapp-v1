import { BsFillTicketFill } from "react-icons/bs";
import { scheduleNavBarDetails } from "@/constant/addschedulenavbar";

export default function DetailsBar() {
  return (
    <div className="rounded-s-xl opacity-70 w-[230px]">
      <div className="p-3.5 flex gap-2.5 ">
        <BsFillTicketFill className="w-5 h-5" /> Schedule
      </div>
      <div>
        {
          scheduleNavBarDetails.map((item, index) => (
            <>
              <div key={index} className="gap-2.5 py-2 px-3.5 hover: cursor-pointer font-bold">{item.name}</div>
            </>
          ))
        }
      </div>
    </div>
  )
}