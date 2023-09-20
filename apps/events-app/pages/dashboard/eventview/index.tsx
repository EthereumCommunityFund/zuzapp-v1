import EventViewPageTemplate from "@/components/templates/EventViewPageTemplate";
import { fetchUserEventSpaces } from "@/services/eventSpaceService";
import { EventSpaceDetailsType } from "@/types";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

export default function EventViewPage() {
  // Make request to get all event spaces

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