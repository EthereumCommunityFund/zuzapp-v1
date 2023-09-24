import SwitchButton from '../ui/buttons/SwitchButton';
import InputFieldLabel from '../ui/labels/inputFieldLabel';
import MediaLink from '../ui/MediaLink';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

interface IProps {
  formData: any;
  setFormData: any;
}

export default function EventLinks(props: IProps) {
  const { setFormData, formData } = props;
  const [isLink, setIsLink] = useState(false);

  const handleChangeSwitch: any = () => {
    setIsLink((prev) => !prev);
  };
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
      {isLink && (
        <div className="flex flex-col gap-5">
          <MediaLink linkType={'Social Media'} formData={formData} setFormData={setFormData} />
          {/* <MediaLink linkType={"Extra Links"} formData={formData} setFormData={setFormData} /> */}
        </div>
      )}
    </div>
  );
}
