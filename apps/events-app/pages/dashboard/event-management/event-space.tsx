import EventLocation from "@/components/eventspace/EventLocation";
import EventSpaceDeatils from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";
import EventStatus from "@/components/eventspace/EventStatus";

export default function EventSpace() {
  return (
    <div className="flex w-full gap-10 overflow-hidden">
      <EventSpaceDetailsNavBar />
      <div className="flex flex-col px-5 w-full gap-[31px]">
        <EventStatus />
        <EventSpaceDeatils />
        <EventLocation />
      </div>
    </div>
  )
}