// create custom hook for fetching event details

import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { EventSpaceDetailsType } from "@/types";
import { isError } from "joi";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const useCurrentEventSpace = () => {
  const router = useRouter();
  const { event_space_id } = router.query;

  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    ["currentEventSpace"], // Query key
    () => fetchEventSpaceById(event_space_id as string),

    {
      onSuccess: (data) => {
        console.log("selectedEventSpace Event Spaces:", data);
      },
    }
  );
  return { eventSpace, isLoading, isError };
};

export default useCurrentEventSpace;
