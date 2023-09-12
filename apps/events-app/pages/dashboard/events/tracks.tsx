import TrackItem from "@/components/tracks/trackItem";
import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { HiPlusCircle } from "react-icons/hi";

export default function Tracks() {
  return (
    <div className="flex flex-col items-center gap-[10px] p-10 self-stretch">
      <div className="flex flex-col items-start gap-[44px]">
        <div className="flex flex-col items-start gap-6 self-stretch">
          <span className="text-[39px] font-bold leading-[1.2]">Tracks</span>
          <Link href={"addtrack"}>
            <Button variant="light-blue" className="rounded-full" leftIcon={HiPlusCircle}>Add a Track</Button>
          </Link>
          {
            <>
              <TrackItem />
              <TrackItem />
            </>
          }
        </div>
        <span className="text-xl font-bold leading-[1.2] opacity-70">Archived Tracks</span>
      </div>
    </div>
  )
}