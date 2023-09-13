import IconButton from "../ui/buttons/IconButton";
import SwitchButton from "../ui/buttons/SwitchButton";
import EventDeatilsDescription1 from "../ui/labels/event-details-description-1";
import EventSpaceLabel from "../ui/labels/event-space-label";
import InputFieldLabel from "../ui/labels/inputFieldLabel";
import { GoPlus } from "react-icons/go";
import ArrowLink from "../ui/links/ArrowLink";
import MediaLink from "../ui/MediaLink";
import Button from "../ui/buttons/Button";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";

export default function EventLinks() {
  const [isLink, setIsLink] = useState(false);

  const handleChangeSwitch = () => {
    setIsLink(prev => !prev);
  }
  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[10px]">
        <Label className="text-2xl opacity-80 leading-[1.2]">Event Links</Label>
        <Label className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px] self-stretch ">Links include social media and other links related to your event</Label>
      </div>
      <div className="flex gap-5 items-center">
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