import { HiClock } from "react-icons/hi";

interface IEventData {
  startTime: string;
  endTime: string;
}

export default function EventDataTime(props: IEventData) {
  const { startTime, endTime } = props;
  return (
    <div className="flex gap-2 items-center bg-trackItemHover md:py-2 md:px-3 sm:py-1 sm:px-1 rounded-xl font-bold opacity-80 md:w-52 z-0 sm:text-sm">
      <HiClock /><span>{startTime} - {endTime}</span>
    </div>
  )
}