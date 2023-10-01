import InPersonEventViewPageTemplate from "@/components/templates/InPersonEventViewPageTemplate";
import EventViewPageTemplate from "@/components/templates/InPersonEventViewPageTemplate";
import OnlineEventViewPageTemplate from "@/components/templates/OnlineEventViewPageTemplate";
import { useEventSpaces } from "@/context/EventSpacesContext";
import { useGlobalContext } from "@/context/GlobalContext";
import { fetchUserEventSpaces } from "@/services/eventSpaceService";
import { EventSpaceDetailsType, EventTypes } from "@/types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function EventViewPage() {
  // Make request to get all event spaces
  const router = useRouter();
  const { eventId } = router.query;
  const { eventSpaceList, setEventSpaceList } = useEventSpaces();
  const eventSpace = eventSpaceList.find((eventSpace) => eventSpace.id === eventId);
  const { isAuthenticated, user } = useGlobalContext();

  const {
    data: eventSpaces,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType[], Error>(
    ['eventSpaces'], // Query key
    () => fetchUserEventSpaces(),
    {
      onSuccess: (data) => {
        console.log('Event Spaces:', data);
        setEventSpaceList(data);
      },
    }
  );


  return (
    <>
      {eventSpace?.format === "in-person" && <InPersonEventViewPageTemplate eventSpace={eventSpace} />}
      {eventSpace?.format === "online" && <OnlineEventViewPageTemplate eventSpace={eventSpace} />}
    </>
  )
}

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient(ctx);
  let {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: null,
        user: null,
      },
    };

  // get profile from session
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};