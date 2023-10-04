import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TrackDetailsPageTemplate from "@/components/templates/TrackDetailsPageTemplate";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "@/components/ui/Loader";

export default function EventViewTrackDetailsPage() {
  const router = useRouter();

  const { eventSpace, isLoading } = useEventDetails();

  const [trackItem, setTrackItem] = useState<any>(); // Initialize trackItem as null

  useEffect(() => {
    const trackId = router.query.trackId;
    const track = eventSpace?.tracks.find((t) => t.id === trackId);

    if (track) {
      setTrackItem(track);
    }
  }, [router.query.trackId, eventSpace?.tracks]);

  if (isLoading) {
    return <Loader />
  }

  return trackItem && <TrackDetailsPageTemplate trackItem={trackItem} />;
}