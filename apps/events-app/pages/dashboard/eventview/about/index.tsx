import InPersonEventViewPageTemplate from "@/components/templates/InPersonEventViewPageTemplate";
import EventViewPageTemplate from "@/components/templates/EventViewPageTemplate";

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { EventSpaceDetailsType } from "@/types";
import { Loader } from "@/components/ui/Loader";

export default function EventViewPage() {
  // Make request to get all event spaces
  const router = useRouter();
  const { event_space_id } = router.query;

  const { data: eventSpace, isLoading } = useQuery<
    EventSpaceDetailsType,
    Error
  >(
    ["currentPublisedEventSpace"], // Query key
    () => fetchEventSpaceById(event_space_id as string),

    {
      onSuccess: (data) => {
        console.log("selectedEventSpace Event Spaces:", data);
      },
    }
  );

  return (
    <>
      <EventViewPageTemplate eventSpace={eventSpace} />
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  await queryClient.prefetchQuery("currentPublisedEventSpace", () =>
    fetchEventSpaceById(event_space_id)
  );

  const supabase = createPagesServerClient(ctx);

  // console.log(dehydrate(queryClient).queries[0].state, "dehydrated");
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
  const { data: profile, error } = await supabase
    .from("profile")
    .select("*")
    .eq("uuid", session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
