import { HiCalendar } from "react-icons/hi";

interface IEventDataDate {
  startDate: string;
  endDate: string;
}

export default function EventDataDate(props: IEventDataDate) {
  const { startDate, endDate } = props;
  return (
    <div className="flex gap-2 items-center bg-trackItemHover md:py-2 md:px-3 sm:py-1 sm:px-1 rounded-xl font-bold opacity-80 md:w-fit z-0 sm:text-sm">
      <HiCalendar /> <span>{startDate} - {endDate}</span>
    </div>
  )
}