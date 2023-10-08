import { BsFillTicketFill } from "react-icons/bs";
import { HiArrowRight, HiCalendar } from "react-icons/hi";
import Button from "../ui/buttons/Button";
import router, { useRouter } from "next/router";
import { TrackCreateRequestBody } from "@/types";

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
  const { event_space_id } = router.query;

  return (
    <div
      className="flex items-center justify-between w-full bg-itemHover rounded-2xl py-3.5 px-3 hover:bg-trackItemHover duration-200 border border-borderSecondary h-40"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 h-full">
        <div className="md:w-40 lg:w-28 bg-white rounded-lg p-1 lg:h-fit md:h-full">
          <img src={trackImage} alt="track-image" className="rounded-lg h-full w-full" />
        </div>
        <div className="flex flex-col w-[382px] justify-center items-start gap-[14px] self-stretch">
          <span className="rounded-full flex px-4 py-1 items-center gap-1 bg-[#FFFFFF10] text-white font-bold">
            {trackTitle}
          </span>
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
          <Button
            variant="dark"
            className="bg-white/20 text-white/70 rounded-full"
            leftIcon={HiArrowRight}
          >
            Enter Track
          </Button>
        </div>
      </div>
    </div>
  );
}
