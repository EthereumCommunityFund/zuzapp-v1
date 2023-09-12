import { useState } from "react";
import Container from "../ui/Container";
import EventBasics from "./EventBasics";
import EventCategoriesLabs from "./EventCategoriesLabs";

import EventFormat from "./EventFormat";
import EventLinks from "./EventLinks";
import EditionButtons from "@/components/ui/buttons/EditionButtons";
import { CgClose } from "react-icons/cg";
import { FaCircleArrowDown } from "react-icons/fa6";


export default function EventSpaceDetails() {
  return (
    <Container>
      <div className="flex flex-col gap-[34px]">
        <span className="text-[25px] font-normal leading-[1.2]">Event Space Details</span>
        <EventBasics />
        <EventFormat setEventCreated={function (eventCreated: boolean): void {
          throw new Error("Function not implemented.");
        }} />
        {/* <EventLinks /> */}
        <EventCategoriesLabs />
        <EditionButtons type={"eventspace"} leftButtonName={"Discard"} rightButtonName={"Save Edit"} leftButtonIcon={CgClose} rightButtonIcon={FaCircleArrowDown} />
      </div>
    </Container>
  )
}