import Link from "next/link";

import TrackItemCard from "./TrackItemCard";
import Button from "@/components/ui/buttons/Button";
import { EventSpaceDetailsType, TrackUpdateRequestBody } from "@/types";
import { BiSolidPlusCircle } from "react-icons/bi";
import { HiCog, HiSelector } from "react-icons/hi";
import router from "next/router";
// import { sampleEvents } from "../HomePageTemplate";

interface TrackTemplateProps {
  trackDetails: TrackUpdateRequestBody[];
}

const TrackItemTemplate: React.FC<TrackTemplateProps> = ({ trackDetails }) => {
  const { event_space_id } = router.query;
  return (
    <div className="flex flex-col gap-[10px] w-full">
      {trackDetails.map((track) => (
        <TrackItemCard
          onClick={() => {
            router.push({
              pathname: `/dashboard/events/space/tracks/schedules`,
              query: {
                trackId: track.id,
                event_space_id,
                track_title: track.name,
              },
            });
          }}
          trackTitle={track.name}
          key={track.id}
          trackId={track.id}
          trackDescription={track?.description as string}
          trackImage={track?.image as string}
        />
      ))}
    </div>
  );
};

export default TrackItemTemplate;
