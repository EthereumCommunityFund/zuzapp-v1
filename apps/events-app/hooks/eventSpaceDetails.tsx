// create custom hook for fetching event details

import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { EventSpaceDetailsType } from "@/types";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const useEventDetails = () => {
    const router = useRouter();
    const { eventId } = router.query;
    const {
        data,
        isLoading,
        isError,
    } = useQuery<EventSpaceDetailsType, Error>(
        ['spaceDetails', eventId], // Query key
        () => fetchEventSpaceById(eventId as string), // Query function
        {
        enabled: !!eventId,
        refetchOnWindowFocus: false, // Only execute the query if eventId is available
        }
    );
    
    return {eventSpace: data};
}

export default useEventDetails;
