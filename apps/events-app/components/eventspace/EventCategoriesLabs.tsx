import { Icon } from "@radix-ui/react-select";
import InputWrapper from "../ui/Input-Wrapper";
import Button from "../ui/buttons/Button";
import IconButton from "../ui/buttons/IconButton";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import EventSpaceLabel from "../ui/labels/event-space-label";
import InputFieldLabel from "../ui/labels/inputFieldLabel";
import { eventCategories } from "@/constant/eventcategories";
import { GoXCircle } from "react-icons/go";
import { experienceLevels } from "@/constant/experienceelevels";

export default function EventCategoriesLabs() {
  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-2.5">
        <EventSpaceLabel name="Manage Event Categories & Labels" />
        <EventDeatilsDescription1 name="These will be shared as attributes by subsequent Tracks & Schedules you create." />
      </div>
      <div className="flex flex-col gap-6">
        <InputFieldLabel name="Add Event Types" />
        <InputWrapper>
          <div className="h-4 opacity-50 text-sm leading-4">Meetups, Parties, Workshops, etc</div>
        </InputWrapper>
        <div className="flex gap-2.5">
          {
            eventCategories.map((eventCategory) => (
              <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={eventCategory.name} /></button>
              </div>
            ))
          }
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <InputFieldLabel name="Experience Levels" />
        <InputWrapper>
          <div className="h-4 opacity-50 text-sm leading-4">Begineer, Intermidate, Advanced</div>
        </InputWrapper>
        <div className="flex gap-2.5">
          {
            experienceLevels.map((experienceLevel) => (
              <div className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10">
                <button className="flex gap-2.5 items-center"><GoXCircle className="top-0.5 left-0.5 w-4 h-4" /><InputFieldLabel name={experienceLevel.name} /></button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}