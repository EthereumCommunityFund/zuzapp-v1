import { BsCalendar2 } from "react-icons/bs";
import { eventDetailsList } from "./eventdetails";

export default function EventSpaceDetailsNavBar() {
  return (
    <div className="rounded-s-xl opacity-70 w-[230px]">
      <div className="p-3.5 flex gap-2.5 ">
        <BsCalendar2 className="w-5 h-5"/> Event Space Details
      </div>
      <div>
        {
          eventDetailsList.map((eventDetailsItem) => (
            <>
              <div className="gap-2.5 py-2 px-3.5 hover: cursor-pointer font-bold">{eventDetailsItem.name}</div>
            </>
          ))
        }
      </div>
    </div>
  )
}