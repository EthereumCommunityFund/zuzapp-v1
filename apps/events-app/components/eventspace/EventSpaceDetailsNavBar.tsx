import { HiCalendar } from 'react-icons/hi';
import { eventDetailsList } from '../../constant/eventdetails';

export default function EventSpaceDetailsNavBar() {
  return (
    <div className="flex flex-col pt-3 rounded-s-xl opacity-70 w-[400px] gap-5 fixed">
      <div className="flex gap-[10px] pl-3  items-center font-bold">
        <HiCalendar className="w-5 h-5" /> Event Space Details
      </div>
      <div className="flex flex-col gap-3">
        {eventDetailsList.map((eventDetailsItem, index) => (
          <div key={index} className=" rounded-xl flex flex-col gap-1 pl-3 py-2 hover:cursor-pointer w-[230px] hover:bg-[#292929] duration-200">
            <div className="text-lg font-semibold opacity-90">{eventDetailsItem.name}</div>
            <div className="text-xs font-light opacity-60">{eventDetailsItem.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
