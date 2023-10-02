import InPersonEventViewPageTemplate from "@/components/templates/InPersonEventViewPageTemplate";
import EventViewPageTemplate from "@/components/templates/InPersonEventViewPageTemplate";
import OnlineEventViewPageTemplate from "@/components/templates/OnlineEventViewPageTemplate";
import { useEventSpaces } from "@/context/EventSpacesContext";
<<<<<<< HEAD
import { useGlobalContext } from "@/context/GlobalContext";
=======
>>>>>>> 507f92f (Add live data to eventview avout page)
import { fetchUserEventSpaces } from "@/services/eventSpaceService";
import { EventSpaceDetailsType, EventTypes } from "@/types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export default function EventViewPage() {
  // Make request to get all event spaces
  const router = useRouter();
  const { eventId } = router.query;
  const { eventSpaceList } = useEventSpaces();
  const eventSpace = eventSpaceList.find((eventSpace) => eventSpace.id === eventId);
<<<<<<< HEAD
  const { isAuthenticated, user } = useGlobalContext();

  return (
    <>
      {
        isAuthenticated && (
          <>
            {eventSpace?.format === "in-person" && <InPersonEventViewPageTemplate eventSpace={eventSpace} />}
            {eventSpace?.format === "online" && <OnlineEventViewPageTemplate eventSpace={eventSpace} />}
          </>
        )
      }
=======


  return (
    <>
      {eventSpace?.format === "in-person" && <InPersonEventViewPageTemplate eventSpace={eventSpace} />}
<<<<<<< HEAD
      {eventSpace?.format === "online" && <OnlineEventViewPageTemplate />}
>>>>>>> 507f92f (Add live data to eventview avout page)
=======
      {eventSpace?.format === "online" && <OnlineEventViewPageTemplate eventSpace={eventSpace} />}
>>>>>>> d44dd1a (Pass live data to trackItem)
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