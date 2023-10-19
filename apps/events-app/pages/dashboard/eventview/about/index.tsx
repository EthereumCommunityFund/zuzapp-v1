
import EventViewPageTemplate from "@/components/templates/EventViewPageTemplate";

import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { QueryClient, dehydrate, useQuery } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { EventSpaceDetailsType } from "@/types";
import { Loader } from "@/components/ui/Loader";
import useEventDetails from "@/hooks/useCurrentEventSpace";

export default function EventViewPage(props: any) {
  // Make request to get all event spaces
  const { profile } = props;
  const { eventSpace, isLoading } = useEventDetails();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        eventSpace && <EventViewPageTemplate eventSpace={eventSpace} profile={profile} />
      )}
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {


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

  // console.log("user", profile);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
      // dehydratedState: dehydrate(queryClient),
    },
  };
};
