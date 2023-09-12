import IconButton from "../ui/buttons/IconButton";
import SwitchButton from "../ui/buttons/SwitchButton";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import EventSpaceLabel from "../ui/labels/event-space-label";
import InputFieldLabel from "../ui/labels/input-field-label";
import { GoPlus } from "react-icons/go";
import ArrowLink from "../ui/links/ArrowLink";
import MediaLink from "../ui/MediaLink";
import Button from "../ui/buttons/Button";
import { useState } from "react";

export default function EventLinks() {
  const [isLink, setIsLink] = useState(false);
  const [isLinkAdded, setIsLinkAdded] = useState(false);

  const handleChangeSwitch = () => {
    setIsLink(prev => !prev);
  }
  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[10px]">
        <EventSpaceLabel name="Event Links" />
        <EventDeatilsDescription1 name="Links include social media and other links related to your event" />
      </div>
      <div className="flex gap-5">
        <SwitchButton value={isLink} onClick={handleChangeSwitch} />
        <InputFieldLabel name="Add Links" />
      </div>
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