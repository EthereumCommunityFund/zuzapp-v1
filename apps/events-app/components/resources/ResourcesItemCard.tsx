import { ResourceItemCard } from "@/types";
import { Label } from "../ui/label";
import { ArrowTopRightOnSquare } from "../ui/icons";
import Button from "../ui/buttons/Button";


export default function ResourcesItemCard({ title, tagLine, prevLink, fullLink }: ResourceItemCard) {
  return (
    <a href={fullLink} target='_blank' className="p-5 bg-componentPrimary hover:bg-itemHover duration-200 rounded-2xl border border-borderPrimary w-full">
      <div className="flex flex-col gap-2.5">
        <Label className="text-xl font-bold text-white">{title}</Label>
        <div className="flex flex-col gap-5">
          <Label className="opacity-80 text-white/80">{tagLine}</Label>
          {/* <Button variant="quiet-SM" className="items-center p-0 break-words" leftIcon={ArrowTopRightOnSquare}>{link}</Button> */}
          <div className="flex gap-2.5 opacity-50 w-full">
            <ArrowTopRightOnSquare />
            <span className="break-all">{prevLink}</span>
          </div>
        </div>
      </div>
    </a>
  )
}
