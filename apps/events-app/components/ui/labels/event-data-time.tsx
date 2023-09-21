import { HiClock } from "react-icons/hi";

interface IEventData {
  startTime: string;
  endTime: string;
}

export default function EventData(props: IEventData) {
  const { startTime, endTime } = props;
  return (
    <span><HiClock />{startTime} - {endTime}</span>
  )
}