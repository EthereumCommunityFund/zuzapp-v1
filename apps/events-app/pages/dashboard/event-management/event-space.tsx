import EventSpaceDeatils from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";

export default function EventSpace() {
  return (
    <div className="flex w-full">
      <EventSpaceDetailsNavBar />
      <EventSpaceDeatils />
    </div>
  )
}