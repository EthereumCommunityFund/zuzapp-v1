import { BsFillTicketFill } from 'react-icons/bs';
import { HiArrowRight, HiCalendar } from 'react-icons/hi';
import Button from '../ui/buttons/Button';
import router, { useRouter } from 'next/router';
import { TrackCreateRequestBody } from '@/types';

interface IProps {
  trackTitle: string;
  trackId?: string;
  trackDescription?: string;
  trackImage: string;
  onClick?: () => void;
}

export default function TrackItem(props: IProps) {
  const { trackTitle, trackId, trackImage, onClick } = props;
  const router = useRouter();
  const { eventId } = router.query;

  const handleEnterTrack = async () => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules`,
        query: { eventId: eventId, trackTitle: trackTitle, trackId: trackId },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  return (
    <div className="flex items-center justify-between w-full bg-itemHover rounded-2xl py-3.5 px-3 hover:bg-trackItemHover duration-200" onClick={onClick}>
      <div className="flex items-center gap-2">
        <div className="w-28 h-fit bg-white rounded-lg p-1">
          <img src={trackImage} alt="track-image" className="rounded-lg h-20" />
        </div>
        <div className="flex flex-col w-[382px] justify-center items-start gap-[14px] self-stretch">
          <span className="rounded-full flex px-4 py-1 items-center gap-1 bg-[#FFFFFF10] text-white font-bold">{trackTitle}</span>
          <div className="flex flex-col justify-center items-start gap-[14px] self-stretch">
            <span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
              <HiCalendar /> October 29 - November 11
            </span>
            {/* <span className="flex items-center gap-1 self-stretch opacity-60 font-bold">
              <BsFillTicketFill /> Schedules 3
            </span> */}
          </div>
        </div>
      </div>
      <div>
        <div className="w-full">
          <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight} onClick={handleEnterTrack}>
            Enter Track
          </Button>
        </div>
      </div>
    </div>
  );
}
