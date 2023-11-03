import { HiCalendar } from "react-icons/hi";
import { Label } from "../label";

interface IEventDataDate {
  startDate: string;

}

export default function EventDataDate(props: IEventDataDate) {
  const { startDate } = props;
  return (
    <div className="flex gap-2 items-center bg-trackItemHover py-1 md:px-3 sm:px-1 rounded-lg font-normal opacity-80 md:w-auto z-0 sm:text-sm">
      <HiCalendar /> <Label>{startDate}</Label>
    </div>
  )
}