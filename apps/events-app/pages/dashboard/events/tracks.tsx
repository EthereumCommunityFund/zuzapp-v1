import TrackItem from "@/components/tracks/trackItem";
import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { BiSolidPlusCircle } from "react-icons/bi";
import { HiCog, HiPlusCircle, HiSelector } from "react-icons/hi";

export default function Tracks() {
  return (
    <div className="flex flex-col flex-1 items-center gap-[10px] pt-10 px-20 pb-0 self-stretch">
      <div className="flex flex-col items-center gap-[44px] self-stretch mx-auto w-[82%]">
        <div className="flex flex-col items-start gap-6 self-stretch">
          <span className="text-[50px] font-bold leading-[1.2]">Tracks</span>
          <div className="flex justify-between items-start self-stretch">
            <Link href={"addtrack"}>
              <Button variant="light-blue" className="rounded-full font-bold" size="lg" leftIcon={BiSolidPlusCircle}>Add a Track</Button>
            </Link>
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="lg" leftIcon={HiSelector}>Sort</Button>
              <Button variant="ghost" size="lg" leftIcon={HiCog}>Select</Button>
            </div>
          </div>
          {
            <div className="flex flex-col items-start gap-[10px] self-stretch">
              <TrackItem />
              <TrackItem />
            </div>
          }
        </div>
      </div>
    </div>
  )
}