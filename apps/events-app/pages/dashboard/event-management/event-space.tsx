import EventLocation from "@/components/eventspace/EventLocation";
import EventSpaceDeatils from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";


export default function EventSpace() {
  return (
    <div className="flex w-full gap-10 overflow-hidden self-stretch">
      <EventSpaceDetailsNavBar />
      <div className="flex flex-col px-5 w-full gap-[31px]">        
      
        <EventSpaceDeatils />
        <EventLocation />
      </div>
    </div>
  )
}