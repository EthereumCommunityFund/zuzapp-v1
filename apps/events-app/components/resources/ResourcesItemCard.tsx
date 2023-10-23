import { ResourceItemCard } from "@/types";
import { Label } from "../ui/label";
import { ArrowTopRightOnSquare } from "../ui/icons";


export default function ResourcesItemCard({ title, tagLine, link }: ResourceItemCard) {
  return (
    <div className="p-5 bg-componentPrimary rounded-2xl border border-borderPrimary">
      <div className="flex flex-col gap-2.5">
        <Label className="text-xl font-bold text-white">{title}</Label>
        <div className="flex flex-col gap-5">
          <Label className="opacity-80 text-white/80">{tagLine}</Label>
          <a className="flex gap-2.5 opacity-50">
            <ArrowTopRightOnSquare /><span>{link}</span>
          </a>
        </div>
      </div>
    </div>
  )
}