import Button from "@/components/ui/buttons/Button";
import { BiRightArrowAlt } from "react-icons/bi";

export default function MyEventSpaces() {
  return (
    <div className="flex flex-col py-20 items-center self-stretch">
      <div className="flex flex-col items-start gap-[66px] w-[880px]">
        <span className="self-stretch text-[31px] font-normal leading-[1.2]">My Event Spaces</span>
        <div className="flex flex-col items-start gap-12 self-stretch">
          <div className="flex flex-col items-start gap-5 self-stretch">
            <span className="text-[25px] font-normal leading-[1.2]">Created Spaces</span>
            <div className="flex px-4 py-5 justify-between items-center self-stretch rounded-2xl border border-white border-opacity-10 bg-[#2E3131]">
              <div className="flex flex-col items-start gap-[14px]">
                <div className="flex py-[3px] px-2 items-start gap-[10px] rounded-[20px] bg-[#67DBFF33]">
                  <span className="text-[13px] font-bold leading-[1.2]">Draft</span>
                </div>
                <span className="text-[25px] font-bold leading-[1.2]">ZuConnect</span>
              </div>
              <Button variant="light-dark" className="rounded-[20px]" leftIcon={BiRightArrowAlt}>
                Enter Space
              </Button>
            </div>
            <div className="flex py-5 px-4 justify-center items-center self-stretch rounded-2xl border border-dashed border-opacity-10 bg-[#2E313120]">
              <button className="w-full text-center text-lg font-semibold leading-[1.2]">
                Create an Event Space
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-5 self-stretch">
          <span className="text-[25px] font-normal leading-[1.2]">Invited Spaces</span>
          <span className="text-base font-semibold tracking-[0.282px] opacity-50">No Invited Spaces</span>
        </div>
      </div>
    </div>
  )
}