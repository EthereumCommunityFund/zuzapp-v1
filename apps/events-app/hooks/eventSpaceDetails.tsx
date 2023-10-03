// create custom hook for fetching event details

import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { EventSpaceDetailsType } from "@/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const useEventDetails = () => {
  const router = useRouter();
  const { event_space_id } = router.query;
  const { data, isLoading, isError } = useQuery<EventSpaceDetailsType, Error>(
    ["spaceDetails", event_space_id], // Query key
    () => fetchEventSpaceById(event_space_id as string), // Query function
    {
      enabled: !!event_space_id,
      refetchOnWindowFocus: false, // Only execute the query if event_space_id is available
    }
  );

  return { eventSpace: data };
};

export default useEventDetails;
