import { BsCalendar2 } from "react-icons/bs";
import { eventDetailsList } from "./eventdetails";

export default function EventSpaceDetailsNavBar() {
  return (
    <div className="px-3.5 gap-2.5 rounded-s-xl opacity-70 font-bold">
      <div className="py-2 px-3.5 flex gap-2.5">
        <BsCalendar2 className="w-5 h-5"/> Event Space Details
      </div>
      <div>
        {
          eventDetailsList.map((eventDetailsItem) => (
            <div className="gap-2.5 py-2 px-3.5">{eventDetailsItem.name}</div>
          ))
        }
      </div>
    </div>
  )
}