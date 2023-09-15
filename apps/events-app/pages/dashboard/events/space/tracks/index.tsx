import TrackItem from "@/components/tracks/trackItem";
import Button from "@/components/ui/buttons/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { BiSolidPlusCircle } from "react-icons/bi";
import { HiCog, HiPlusCircle, HiSelector } from "react-icons/hi";

export default function Tracks() {
  const router = useRouter();
  const { eventId } = router.query;

  const handleAddTrack = async () => {
    try {
      // Redirect to a new page with the fetched details
      router.push({
        pathname: `tracks/addtrack`, // Update with your actual route
        query: { eventId: eventId }, // Pass space ID as a query parameter
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center gap-[10px] pt-10 px-20 pb-0 self-stretch">
      <div className="flex flex-col items-center gap-[44px] self-stretch mx-auto w-[82%]">
        <div className="flex flex-col items-start gap-7 self-stretch">
          <span className="text-[50px] font-bold leading-[1.2]">Tracks</span>
          <div className="flex justify-between items-start self-stretch">
            <Button variant="light-blue" className="rounded-full font-bold" size="lg" leftIcon={BiSolidPlusCircle} onClick={handleAddTrack}>Add a Track</Button>
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="base" className="font-bold opacity-70" leftIcon={HiSelector}>Sort</Button>
              <Button variant="ghost" size="base" className="font-bold opacity-70" leftIcon={HiCog}>Select</Button>
            </div>
          </div>
          <div className="flex flex-col items-start gap-[10px] self-stretch">
            <TrackItem title={"Zk Week"} />
            <TrackItem title={"Track Title"} />
            <TrackItem title={"Track Title"} />
          </div>
        </div>
      </div>
    </div>
  )
}