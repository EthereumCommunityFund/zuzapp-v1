import { ZappCardTemplate } from "@/types";
import { Label } from "@radix-ui/react-label";
import Button from "../ui/buttons/Button";
import { BiCode } from "react-icons/bi";

export default function ZappCardComponentTemplate(props: ZappCardTemplate) {
  const { imgURL, appTitle, appDescription, appContents } = props;
  return (
    <div className="flex flex-col p-2.5 bg-componentPrimary rounded-md md:w-80 sm:w-full">
      {imgURL ?
        <img className="rounded-lg h-32" src={imgURL} alt="item-card" /> :
        <div className="flex h-32 items-center justify-center">
          <Label className="text-white text-xl">Your App</Label>
        </div>
      }
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-2.5">
          <Label className="text-white text-lg">
            {appTitle}
          </Label>
          <Label className="text-white/70 text-base">
            {appDescription}
          </Label>
        </div>
        <div className="flex gap-2.5">
          {appContents ?
            appContents.map((appContent) => {
              return (
                <Label className="py-1 px-2.5 bg-itemBgPrimary text-white/60 text-sm">{appContent}</Label>
              )
            }) :
            <Button variant='quiet-SM' leftIcon={BiCode} className="rounded-md" >Start Building</Button>
          }

        </div>
      </div>
    </div>
  )
}