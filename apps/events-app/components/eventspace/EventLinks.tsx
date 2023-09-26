import { GoXCircle } from "react-icons/go";
import SwitchButton from "../ui/buttons/SwitchButton";
import InputFieldLabel from "../ui/labels/inputFieldLabel";
import MediaLink from "../ui/MediaLink";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import LinksField from "./LinksField";

interface IProps {
  formData: any;
  setFormData: any;
  social_links: string[];
  extra_links: string[];
  setSocialLinks: any;
  setExtraLinks: any;
}

export default function EventLinks(props: any) {
  const {
    setFormData,
    formData,
    social_links,
    extra_links,
    setSocialLinks,
    setExtraLinks,
  } = props;
  const [isLink, setIsLink] = useState(false);

  const handleChangeSwitch: any = () => {
    setIsLink((prev) => !prev);
  };
  return (
    <div className="flex flex-col gap-[34px]">
      <div className="flex flex-col gap-[10px]">
        <Label className="text-2xl opacity-80 leading-[1.2]">Event Links</Label>
        <Label className="opacity-70 h-[18px] font-normal text-[13px] leading-[18.2px] tracking-[0.13px] self-stretch ">
          Links include social media and other links related to your event
        </Label>
      </div>
      <div className="flex gap-5 items-center">
        <SwitchButton value={isLink} onClick={handleChangeSwitch} />
        <InputFieldLabel name="Add Links" />
      </div>
      {isLink && (
        <div className="flex flex-col gap-5">
          {/* <MediaLink linkType={'Social Media'} formData={formData} setFormData={setFormData} /> */}
          <LinksField
            socialLinks={social_links}
            extraLinks={extra_links}
            setSocialLinks={setSocialLinks}
            setExtraLinks={setExtraLinks}
          />
          {/* <MediaLink linkType={"Extra Links"} formData={formData} setFormData={setFormData} /> */}
        </div>
      )}
      {/* <div className="flex gap-2.5">
        {social_links?.map((link, index) => (
          <div
            key={eventCategory}
            className="flex gap-2.5 items-center rounded-[8px] px-2 py-1.5 bg-white bg-opacity-10"
          >
            <button className="flex gap-2.5 items-center">
              <GoXCircle
                onClick={() => handleRemoveEventType(index)}
                className="top-0.5 left-0.5 w-4 h-4"
              />
              <span className="text-lg font-semibold leading-[1.2] text-white self-stretch">
                {link}
              </span>
            </button>
          </div>
        ))}
    </div> */}
    </div>
  );
}
