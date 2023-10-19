import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TrackDetailsPageTemplate from "@/components/templates/TrackDetailsPageTemplate";
import useEventDetails from "@/hooks/useCurrentEventSpace";
import { Loader } from "@/components/ui/Loader";
import { QueryClient, dehydrate } from "react-query";
import { fetchEventSpaceById } from "@/services/fetchEventSpaceDetails";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import useTrackDetails from "@/hooks/useTrackDetails";

export default function EventViewTrackDetailsPage(props: any) {
  const { organizers } = props;

  const { trackDetails, isLoading: LoadingTrack } = useTrackDetails();

  return (
    trackDetails && (
      <TrackDetailsPageTemplate
        trackItem={trackDetails}
        organizers={organizers}
      />
    )
  );
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  await queryClient.prefetchQuery("currentEventSpace", () =>
    fetchEventSpaceById(event_space_id)
  );
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

  return {
    props: {
      initialSession: session,
      user: session?.user,

      dehydratedState: dehydrate(queryClient),
    },
  };
};
