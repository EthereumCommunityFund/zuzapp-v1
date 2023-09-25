import { HiCalendar } from "react-icons/hi";

interface IEventDataDate {
  startDate: string;
  endDate: string;
}

export default function EventDataDate(props: IEventDataDate) {
  const { startDate, endDate } = props;
  return (
    <div className="flex gap-2 items-center bg-trackItemHover py-2 px-3 rounded-xl font-bold opacity-80">
      <HiCalendar /> <span>{startDate} - {endDate}</span>
    </div>
  )
}