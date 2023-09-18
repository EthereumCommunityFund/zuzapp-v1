import { BiLeftArrowAlt, BiEditAlt, BiPlus, BiRadioCircle, BiCalendarAlt, BiTimeFive, BiRadioCircleMarked, BiPlusCircle } from "react-icons/bi";
import { HiArrowLeft, HiCog, HiSelector } from "react-icons/hi";

import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsFillPlusCircleFill } from "react-icons/bs";
import IconButton from "@/components/ui/buttons/IconButton";

export default function SchedulesDashboardPage() {
  const router = useRouter();
  const { eventId } = router.query;

  const goBackToPreviousPage = () => {
    router.back();
  };

  return (
    <div className="pt-10">
      <div className="flex flex-col items-start gap-10 self-stretch pb-[60px] px-20">
        <div className="w-full flex flex-col justify-start items-start relative p-0 gap-[30px] rounded-0">
          <div className="flex w-full justify-between items-center flex-1 flex-grow-0">
            <Button
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={HiArrowLeft}
              onClick={goBackToPreviousPage}
            >
              Back
            </Button>
            <Button
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={BiEditAlt}
            >
              Edit
            </Button>
          </div>
          <div className="flex flex-col gap-[30px] self-stretch">
            <div className="flex items-start gap-[10px] self-stretch">
              <div className="w-28 h-28 bg-black rounded-lg"></div>
              <div className="flex flex-col gap-5 self-stretch">
                <h2 className="text-4xl font-semibold">Zk Week</h2>
                <h3 className="text-2xl leading-[1.2] opacity-70 font-bold">Schedules</h3>
              </div>
            </div>
            <div className="flex justify-between items-start self-stretch">
              <Link href={"addschedule"}>
                <Button variant="light-blue" className="flex py-[10px] px-[14px] items-center gap-[10px] rounded-[20px] bg-[#67DAFF20] text-[#67DAFF] text-xl" leftIcon={BsFillPlusCircleFill}>Add a Schedule</Button>
              </Link>
              <div className="flex items-start gap-3">
                <Button
                  className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
                  size="lg"
                  leftIcon={HiSelector}
                >
                  Sort
                </Button>
                <Button
                  className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
                  size="lg"
                  leftIcon={HiCog}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-[30px] w-full">
          <span className="text-base font-bold opacity-70">PUBLISHED</span>
          <div className="flex flex-col items-start gap-[10px] self-stretch">
            <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-full">
              <div className="flex items-start gap-[10px] w-full">
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
            <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-full">
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
        <div className="flex flex-col items-start gap-[30px] w-full">
          <span className="text-[13px] font-bold leading-[1.2] opacity-70">DRAFTS</span>
          <div className="flex flex-col items-start gap-[10px] self-stretch">
            <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-full">
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
        <div className="flex flex-col items-start gap-[30px] w-full">
          <span className="text-[13px] font-bold leading-[1.2] opacity-70">Archived</span>
          <div className="flex flex-col items-start gap-[10px] self-stretch">
            <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-full">
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
            <div className="flex py-3 px-3.5 items-center gap-[364px] rounded-2xl border border-white border-opacity-10 bg-[#2E3131] w-full">
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
    </div>
  )
}