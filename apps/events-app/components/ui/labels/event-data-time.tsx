import { HiClock } from 'react-icons/hi';
import { Label } from '../label';

interface IEventData {
  startTime: string;
  endTime: string;
  iconSize?: number;
}

export default function EventDataTime(props: IEventData) {
  const { startTime, endTime, iconSize } = props;
  return (
    <div className="flex gap-2 items-center bg-trackItemHover py-1 md:px-3 sm:px-1 rounded-lg font-normal opacity-80 md:w-auto z-0 sm:text-sm">
      <HiClock size={iconSize || 25} />
      <Label>
        {startTime} - {endTime}
      </Label>
    </div>
  );
}
