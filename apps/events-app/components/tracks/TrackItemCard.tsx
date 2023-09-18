import { BsFillTicketFill } from 'react-icons/bs';
import { HiArrowRight, HiCalendar } from 'react-icons/hi';
import Button from '../ui/buttons/Button';
import router, { useRouter } from 'next/router';

interface IProps {
  trackTitle: string;
  trackId: string;
}

export default function TrackItem(props: IProps) {
  const { trackTitle, trackId } = props;
  const router = useRouter();
  const { eventId } = router.query;

  const handleEnterTrack = async () => {
    try {
      router.push({
        pathname: `/dashboard/events/space/tracks/schedules`,
        query: { eventId: eventId, trackId: trackId },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  return (
    <div className="flex items-center justify-between w-full bg-background rounded-2xl py-3.5 px-3 hover:bg-itemHover duration-200">
      <div className="flex items-start gap-2">
        <div className="w-[130px] h-[100px] rounded-[10px] border border-[#FFFFFF10] bg-[#222]"></div>
        <div className="flex flex-col w-[382px] justify-center items-start gap-[14px] self-stretch">
          <span className="text-lg font-semibold leading-[1.2]">{trackTitle}</span>
          <div className="flex flex-col justify-center items-start gap-[14px] self-stretch">
            <span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold">
              <HiCalendar /> October 8 - October 23
            </span>
            <span className="flex items-center gap-1 self-stretch opacity-60 font-bold">
              <BsFillTicketFill /> Schedules 3
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full">
          <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight} onClick={handleEnterTrack}>
            Update Track
          </Button>
        </div>
      </div>
    </div>
  );
}
