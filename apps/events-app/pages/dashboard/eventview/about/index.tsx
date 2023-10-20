import EventViewPageTemplate from "@/components/templates/EventViewPageTemplate";


import { Loader } from "@/components/ui/Loader";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { useGlobalContext } from "@/context/GlobalContext";

export default function EventViewPage() {
  // Make request to get all event spaces
  const { profile } = useGlobalContext();
  const { eventSpace, isLoading } = useEventDetails();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        eventSpace && (
          <EventViewPageTemplate eventSpace={eventSpace} profile={profile} />
        )
      )}
    </>
  );
}

