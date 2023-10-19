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
      className="flex md:items-center items-start justify-between w-full bg-itemHover rounded-2xl py-3.5 px-3 hover:bg-trackItemHover duration-200 border border-borderSecondary sm:text-sm md:h-32"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="bg-white rounded-lg p-1 w-[130px]">
          <img
            src={trackImage}
            alt="track-image"
            className="rounded-lg object-cover"
            // width={130}
            // height={100}
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-[14px] w-full md:w-auto self-stretch">
          <div className="flex items-center w-full gap-5 justify-between">
            <span className="rounded-full flex px-4 py-1 items-center gap-1 bg-[#FFFFFF10] text-white font-bold md:text-lg sm:text-base">
              {trackTitle}
            </span>
            <div className=" md:hidden block">
         
              <Button
                variant="dark"
                className="bg-white/20  text-black rounded-full text-sm md:text-base mx-2"
                leftIcon={HiArrowRight}
              >
                <span className="hidden">Enter Track</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start gap-[14px] self-stretch">
            <span className="rounded-lg flex md:px-4 sm:px-1 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10] font-bold md:text-base sm:text-[10px]">
              <HiCalendar /> October 29 - November 11
            </span>
            {/* <span className="flex items-center gap-1 self-stretch opacity-60 font-bold">
              <BsFillTicketFill /> Schedules 3
            </span> */}
          </div>
        </div>
      </div>

      <div>
        <div className="w-full hidden md:block">
          {/* <Button variant="dark" className="bg-white/20 text-white/70 rounded-full" leftIcon={HiArrowRight}>
            Enter Track
          </Button> */}
          <Button
            variant="dark"
            className="bg-white/20  text-black rounded-full text-sm md:text-base mx-2"
            leftIcon={HiArrowRight}
          >
            <span className="hidden md:block">Enter Track</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
