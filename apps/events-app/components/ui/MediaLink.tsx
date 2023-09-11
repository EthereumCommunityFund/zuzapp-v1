import { RxMinus, RxPlus } from "react-icons/rx";
import IconButton from "./buttons/IconButton";
import { useState } from "react";
import DropDown from "./dropDown";
import { Input } from "./input";

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
        <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxPlus} onClick={() => setIsLink(!isLink)}></IconButton>
      </div>
      {
        isLink && (
          <div className="flex items-end gap-5 self-stretch">
            <DropDown />
            <Input />
            <IconButton className="rounded-[40px] py-2.5 px-3.5 bg-[#F1F1F1] bg-opacity-20 border-none" icon={RxMinus} onClick={() => setIsLink(!isLink)}></IconButton>
          </div>
        )
      }
    </>
  )
}