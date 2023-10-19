import EventViewPageTemplate from '@/components/templates/EventViewPageTemplate';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useQuery } from 'react-query';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import { EventSpaceDetailsType } from '@/types';
import { Loader } from '@/components/ui/Loader';
import useEventDetails from '@/hooks/useCurrentEventSpace';

export default function EventViewPage() {
  // Make request to get all event spaces
  const router = useRouter();
  const { eventSpace, isLoading } = useEventDetails();

  return <>{isLoading ? <Loader /> : eventSpace && <EventViewPageTemplate eventSpace={eventSpace} />}</>;
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  // await queryClient.prefetchQuery("currentEventSpace", () =>
  //   fetchEventSpaceById(event_space_id)
  // );

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
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

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
