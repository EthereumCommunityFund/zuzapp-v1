import EventLocation from "@/components/eventspace/EventLocation";
import EventSpaceDetails from "@/components/eventspace/EventSpaceDetails";
import EventSpaceDetailsNavBar from "@/components/eventspace/EventSpaceDetailsNavBar";
import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";


export default function EventSpaceDetailsPage() {
  return (
    <div className="flex flex-col py-5 px-10 items-center gap-[10px] self-stretch">
      <div className="flex items-start gap-8 self-stretch justify-between">
        <EventSpaceDetailsNavBar />
        <div className="flex flex-col px-5 gap-5 items-start">
          <Link href={"spacedashboard"}>
            <Button
              className="rounded-[40px] py-2.5 px-3.5 bg-bgPrimary border-none hover:bg-[#363636] duration-200 text-textSecondary hover:text-textSecondary"
              size="lg"
              leftIcon={HiArrowLeft}
            >
              Back
            </Button>
          </Link>
          <EventSpaceDetails />
          <EventLocation />
        </div>
      </div>
    </div>
  )
}