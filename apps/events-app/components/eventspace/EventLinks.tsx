import IconButton from "../ui/buttons/IconButton";
import SwitchButton from "../ui/buttons/SwitchButton";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import EventSpaceLabel from "../ui/labels/event-space-label";
import EventSpaceLabel1 from "../ui/labels/event-space-label-1";
import { GoPlus } from "react-icons/go";
import ArrowLink from "../ui/links/ArrowLink";
import MediaLink from "../ui/MediaLink";

export default function EventLinks(){
  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[10px]">
        <EventSpaceLabel name="Event Links"/>
        <EventDeatilsDescription1 name="Links include social media and other links related to your event"/>
      </div>
      <div className="flex gap-5">
        <SwitchButton />
        <EventSpaceLabel1 name="Add Links"/>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex gap-5 items-center">
          <EventSpaceLabel1 name="Social Media"/>
          <IconButton icon={GoPlus} className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none"/>
        </div>
        <div>
          <MediaLink />
        </div>
        <div>
          
        </div>
        <div>
          
        </div>
      </div>
    </div>
  )
}