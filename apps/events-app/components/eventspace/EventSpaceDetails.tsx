import { HiArrowLeft } from "react-icons/hi";

import Button from "../ui/buttons/Button";
import EventBasics from "./EventBasics";
import EventCategoriesLabs from "./EventCategoriesLabs";

import EventFormat from "./EventFormat";
import EventLinks from "./EventLinks";
import EditionButtons from "@/components/ui/buttons/EditionButtons";


export default function EventSpaceDetails() {
  return (
    <Container>
      <div className="flex flex-col gap-[34px]">
        <span className="text-[25px] font-normal leading-[1.2]">Event Space Details</span>
        <EventBasics />
        <EventFormat setEventCreated={function (eventCreated: boolean): void {
          throw new Error("Function not implemented.");
        }} />
        <EventLinks />
        <EventCategoriesLabs />
        <EditionButtons type="Event-Space-Details" />
      </div>
    </Container>
  )
}