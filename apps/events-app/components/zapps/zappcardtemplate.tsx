import { ZappCardTemplate } from "@/types";
import { Label } from "@radix-ui/react-label";

export default function ZappCardComponentTemplate(props: ZappCardTemplate) {
  const { imgURL, appTitle, appDescription, appContents } = props;
  return (
    <div className="flex flex-col p-2.5 bg-componentPrimary">
      {imgURL ?
        <img className="rounded-lg h-32" src={imgURL} alt="item-card" /> :
        <div className=" backdrop:blur-lg">
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
          {appContents &&
            appContents.map((appContent) => {
              return (
                <Label className="py-1 px-2.5 bg-itemBgPrimary text-white/60">{appContent}</Label>
              )
            })
          }

        </div>
      </div>
    </div>
  )
}