import { HiCalendar } from "react-icons/hi";

interface IEventData {
  startDate: string;
  endDate: string;
}

export default function EventData(props: IEventData) {
  const { startDate, endDate } = props;
  return (
    <span><HiCalendar />{startDate} - {endDate}</span>
  )
}