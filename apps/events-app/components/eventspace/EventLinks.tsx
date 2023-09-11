import IconButton from "../ui/buttons/IconButton";
import SwitchButton from "../ui/buttons/SwitchButton";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import EventSpaceLabel from "../ui/labels/event-space-label";
import EventSpaceLabel1 from "../ui/labels/event-space-label-1";
import { GoPlus } from "react-icons/go";
import ArrowLink from "../ui/links/ArrowLink";
import MediaLink from "../ui/MediaLink";
import Button from "../ui/buttons/Button";
import { useState } from "react";

export default function EventLinks() {
  const [isLink, setIsLink] = useState(false);
  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[10px]">
        <EventSpaceLabel name="Event Links" />
        <EventDeatilsDescription1 name="Links include social media and other links related to your event" />
      </div>

      <button className="flex gap-5" onClick={() => setIsLink(!isLink)}>
        {/* <SwitchButton /> */}
        <EventSpaceLabel1 name="Add Links" />
      </button>
      {
        isLink && (
          <div className="flex flex-col gap-5">
            <MediaLink linkType={"Social Media"} />
            <MediaLink linkType={"Extra Links"} />
          </div>
        )
      }
    </div>
  )
}