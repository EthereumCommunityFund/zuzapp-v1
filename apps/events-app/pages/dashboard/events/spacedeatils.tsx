import EventLocation from "@/components/eventspace/EventLocation";
import EventSpaceDeatils from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";
import Button from "@/components/ui/buttons/Button";
import { HiArrowLeft } from "react-icons/hi";


export default function EventSpaceDeatilsPage() {
  return (
    <div className="flex py-5 px-10 flex-col flex-1 items-center gap-[10px] self-stretch">
      <div className="flex items-start gap-8 self-stretch">
        <EventSpaceDetailsNavBar />
        <div className="flex flex-col px-5 gap-5 justify-center items-start flex-1">
          <Button leftIcon={HiArrowLeft} variant="light-dark">Back</Button>
          <EventSpaceDeatils />
          <EventLocation />
        </div>
      </div>
    </div>
  )
}