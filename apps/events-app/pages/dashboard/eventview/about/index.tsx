import InPersonEventViewPageTemplate from "@/components/templates/InPersonEventViewPageTemplate";
import EventViewPageTemplate from "@/components/templates/EventViewPageTemplate";
import OnlineEventViewPageTemplate from "@/components/templates/OnlineEventViewPageTemplate";
import { useEventSpace } from "@/context/EventSpaceContext";



import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { EventSpaceDetailsType } from "@/types";

export default function EventViewPage() {
  // Make request to get all event spaces
  const router = useRouter();
  const { eventId } = router.query;
  const { setEventSpace } = useEventSpace();



  const {
    data: selectedEventSpace,
  } = useQuery<EventSpaceDetailsType, Error>(
    ['eventSpace'], // Query key
    () => fetchEventSpaceById(eventId as string),
    {
      onSuccess: (data) => {
        console.log('selectedEventSpace Event Spaces:', data);
        setEventSpace(data);
      },
    }
  );


  return (
    <>
      <EventViewPageTemplate />
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