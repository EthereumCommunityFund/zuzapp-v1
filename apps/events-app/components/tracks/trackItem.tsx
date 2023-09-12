import { BsCalendar2 } from "react-icons/bs"

export default function TrackItem(){
  return (
    <div className="flex py-3 px-3.5 items-center gap-[364px] self-stretch">
      <div className="flex items-start gap-[10px]">
        <div className="w-[130px] h-[100px] rounded-[10px] border border-[#FFFFFF10] bg-[#222]"></div>
        <div className="flex flex-col w-[382px] justify-center items-start gap-[14px] self-stretch">
          <span className="text-lg font-semibold leading-[1.2]">ZK Week</span>
          <div className="flex flex-col justify-center items-start gap-[14px] self-stretch">
            <span className="flex px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]">
              <BsCalendar2 /> October 8 ~ Octorber 23
            </span>
            <span className="flex items-center gap-1 self-stretch opacity-60">
              <BsCalendar2 /> Schedules 3
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}