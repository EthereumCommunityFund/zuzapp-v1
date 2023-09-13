import { RxMinus, RxPlus } from "react-icons/rx";
import IconButton from "./buttons/IconButton";
import { useState } from "react";

import { Input } from "./input";
import InputFieldDark from "./inputFieldDark";
import { InputFieldType } from "@/types";

interface IProps {
  linkType: string
}

export default function MediaLink(props: IProps) {
  const { linkType } = props;
  const [isLink, setIsLink] = useState(false);

  return (
    <>
      <div className="flex gap-5">
        <div className="font-semibold text-base leading-[19.px] flex items-center">{linkType}</div>
        <IconButton variant="dark" className="rounded-full" icon={RxPlus} onClick={() => setIsLink(!isLink)}></IconButton>
      </div>
      {
        isLink && (
          <div className="flex gap-5 justify-between items-center">
            <div className="flex gap-4 w-fill-available">
              <InputFieldDark className="w=1/2" type={InputFieldType.Option} placeholder="Social Media" />
              <InputFieldDark type={InputFieldType.Link} placeholder={"Enter Url"} />
            </div>
            <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxMinus} onClick={() => setIsLink(!isLink)}></IconButton>
          </div>
        )
      }
    </>
  )
}