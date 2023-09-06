import EventSpaceDeatils from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";
import EventStatus from "@/components/eventspace/EventStatus";

export default function EventSpace() {
  return (
    <div className="flex w-full gap-10">
      <EventSpaceDetailsNavBar />
      <div className="px-5 w-full gap-[31px]">
        <EventStatus />
        <EventSpaceDeatils />
      </div>
    </div>
  )
}