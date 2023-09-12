import EventLocation from "@/components/eventspace/EventLocation";
import EventSpaceDeatils from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";
import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft } from "react-icons/hi";


export default function EventSpace() {
  return (
    <div className="flex w-full gap-10 overflow-hidden self-stretch">
      <EventSpaceDetailsNavBar />
      <div className="flex flex-col px-5 w-full gap-[31px]">        
        <Button leftIcon={HiArrowLeft} variant="light-dark">Back</Button>
        <EventSpaceDeatils />
        <EventLocation />
      </div>
    </div>
  )
}