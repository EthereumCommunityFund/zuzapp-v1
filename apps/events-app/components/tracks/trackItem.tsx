import { BsFillTicketFill } from "react-icons/bs"
import { HiCalendar } from "react-icons/hi";

interface IProps {
  title: string
}

export default function TrackItem(props: IProps) {
  const { title } = props;

  return (
    <div className="flex py-3 px-3.5 items-center self-stretch border rounded-2xl border-white/20 bg-[#2E3131] hover:cursor-pointer hover:bg-[#393C3C] duration-200">
      <div className="flex items-start gap-[10px]">
        <div className="w-[130px] h-[100px] rounded-[10px] border border-[#FFFFFF10] bg-[#222]"></div>
        <div className="flex flex-col w-[382px] justify-center items-start gap-[14px] self-stretch">
          <span className="text-lg font-semibold leading-[1.2]">{title}</span>
          <div className="flex flex-col justify-center items-start gap-[14px] self-stretch">
            <span className="rounded-full flex px-4 py-1 items-center gap-1 opacity-60 bg-[#FFFFFF10]">
              <HiCalendar /> October 8 - October 23
            </span>
            <span className="flex items-center gap-1 self-stretch opacity-60">
              <BsFillTicketFill /> Schedules 3
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}