import Button from "../ui/buttons/Button";
import { HiArrowCircleUp } from "react-icons/hi";

export default function EventVisibility() {
  return (
    <div className="px-4 py-5 rounded-2xl border border-opacity-10 border-white gap-8 bg-opacity-10 bg-[#2E3131] w-full">
      <div className="gap-2.5 w-full flex flex-col">
          <div className="text-xl font-bold leading-6 h-6">Event Visibility</div>
          <div className="font-normal text-[13px] leading-4.75 opacity-70 h-4.5">You Event Is Not Published</div>
          <Button className="rounded-full flex justify-center" leftIcon={HiArrowCircleUp} variant="primary">Publish Event</Button>
      </div>
    </div>
  )
}