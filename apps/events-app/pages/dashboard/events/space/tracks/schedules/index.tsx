import { BiLeftArrowAlt, BiEditAlt, BiPlus, BiRadioCircle, BiCalendarAlt, BiTimeFive, BiRadioCircleMarked } from "react-icons/bi";
import { HiCog, HiSelector } from "react-icons/hi";

import Button from "@/components/ui/buttons/Button";
import Link from "next/link";

export default function SchedulesDashboardPage() {
  return (
    <div className="flex flex-col items-start gap-10 self-stretch">
      <div className="flex-shrink-0 w-[750px] flex flex-col justify-start items-start relative p-0 gap-[30px] rounded-0">
        <div className="flex-shrink-0 flex w-full justify-between items-center flex-1 flex-grow-0">
          <Button className="light-dark" leftIcon={BiLeftArrowAlt}> Back </Button>
          <Button className="dark rounded-2xl" leftIcon={BiEditAlt}> Edit </Button>
        </div>
        <div className="flex flex-col gap-[30px] self-stretch">
          <div className="flex items-start gap-[10px] self-stretch">
            <div className="w-16 h-16"></div>
            <div className="flex flex-col gap-5 self-stretch">
              <span className="text-[31px] leading-[1.2]">Zk Week</span>
              <span className="text-xl leading-[1.2] opacity-70">Schedules</span>
            </div>
          </div>
          <div className="flex justify-between items-start self-stretch">
            <Link href={"addschedule"}>
              <Button className="flex py-[10px] px-[14px] items-center gap-[10px] rounded-[20px] bg-[#67DAFF20] text-[#67DAFF]" leftIcon={BiPlus}>Add a Schedule</Button>
            </Link>
            <div className="flex items-start gap-3">
              <Button className="flex p-[10px] items-center gap-[10px] justify-center" leftIcon={HiSelector}>Sort</Button>
              <Button className="flex p-[10px] items-center gap-[10px] justify-center" leftIcon={HiCog}>Select</Button>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="flex flex-col items-start gap-[30px] ">
        <span className="text-[13px] font-bold leading-[1.2] opacity-70">PUBLISHED</span>
        <div className="flex flex-col items-start gap-[10px] self-stretch">
          <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-[750px]">
            <div className="flex items-start gap-[10px]">
              <BiRadioCircle className="w-5 h-5" />
              <div className="flex flex-col items-start gap-[10px]">
                <span className="text-[18px] font-semibold leading-[1.2]">Autonomous World's Assembly</span>
                <div className="flex items-start gap-[10px]">
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiCalendarAlt />October 8</span>
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiTimeFive />00:00 - 00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[10px] self-stretch">
          <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-[750px]">
            <div className="flex items-start gap-[10px]">
              <BiRadioCircle className="w-5 h-5" />
              <div className="flex flex-col items-start gap-[10px]">
                <span className="text-[18px] font-semibold leading-[1.2]">{`PROGRAMMABLE CRYPTOGRAPHY CONFERENCE (PROGCRYPTO)`}</span>
                <div className="flex items-start gap-[10px]">
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiCalendarAlt />October 8</span>
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiTimeFive />00:00 - 00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-[30px]">
        <span className="text-[13px] font-bold leading-[1.2] opacity-70">DRAFTS</span>
        <div className="flex flex-col items-start gap-[10px] self-stretch">
          <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-[750px]">
            <div className="flex items-start gap-[10px]">
              <BiRadioCircleMarked className="w-5 h-5" />
              <div className="flex flex-col items-start gap-[10px]">
                <span className="text-[18px] font-semibold leading-[1.2]">Town Hall</span>
                <div className="flex items-start gap-[10px]">
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiCalendarAlt />October 8</span>
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiTimeFive />00:00 - 00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-[30px]">
        <span className="text-[13px] font-bold leading-[1.2] opacity-70">Archived</span>
        <div className="flex flex-col items-start gap-[10px] self-stretch">
          <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-[750px]">
            <div className="flex items-start gap-[10px]">
              <BiRadioCircle className="w-5 h-5" />
              <div className="flex flex-col items-start gap-[10px]">
                <span className="text-[18px] font-semibold leading-[1.2]">Town Hall</span>
                <div className="flex items-start gap-[10px]">
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiCalendarAlt />October 8</span>
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiTimeFive />00:00 - 00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[10px] self-stretch">
          <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-[750px]">
            <div className="flex items-start gap-[10px]">
              <BiRadioCircle className="w-5 h-5" />
              <div className="flex flex-col items-start gap-[10px]">
                <span className="text-[18px] font-semibold leading-[1.2]">Town Hall</span>
                <div className="flex items-start gap-[10px]">
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiCalendarAlt />October 8</span>
                  <span className="flex h-[29.493px] px-[10px] items-center gap-1 rounded-[10px] opacity-60 bg-[#FFFFFF10]"><BiTimeFive />00:00 - 00:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}