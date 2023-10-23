import { ZappCardTemplate } from "@/types";
import { Label } from "@radix-ui/react-label";
import Button from "../ui/buttons/Button";
import { BiCode } from "react-icons/bi";

export default function ZappCardComponentTemplate(props: ZappCardTemplate) {
  const { imgURL, appTitle, appTagLine, appContents } = props;
  return (
    <div className="flex flex-col p-2.5 bg-componentPrimary rounded-2xl md:w-72 sm:w-full h-80 hover:bg-itemHover hover:cursor-pointer gap-3.5">
      <img className="rounded-[10px] h-[120px] w-full object-cover" src={imgURL ? `${imgURL}` : `/images/zapps/new.png`} alt="item-card" />
      <div className="flex flex-col gap-3.5 w-full">
        <div className="flex flex-col gap-2.5">
          <Label className="text-white text-xl font-bold">
            {appTitle}
          </Label>
          <Label className="text-white/70 text-sm font-bold">
            {appTagLine}
          </Label>
        </div>
        <div className="flex gap-2.5">
          {appContents ?
            appContents.map((appContent) => {
              return (
                <Label className="py-1 px-2.5 bg-white/10 text-white/60 text-[13px] rounded-[10px] font-semibold">{appContent}</Label>
              )
            }) :
            <Button variant='quiet-SM' leftIcon={BiCode} className="rounded-2xl w-full justify-center bg-white/10" >Start Building</Button>
          }
        </div>
      </div>
    </div>
  )
}