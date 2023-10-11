import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TrackDetailsPageTemplate from '@/components/templates/TrackDetailsPageTemplate';
import useEventDetails from '@/hooks/useCurrentEventSpace';
import { Loader } from '@/components/ui/Loader';
import { QueryClient, dehydrate } from 'react-query';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default function EventViewTrackDetailsPage() {
  const router = useRouter();

  const { eventSpace, isLoading } = useEventDetails();

  const [trackItem, setTrackItem] = useState<any>(); // Initialize trackItem as null

  useEffect(() => {
    const trackId = router.query.trackId;
    const track = eventSpace?.tracks.find((t) => t.id === trackId);

    if (track) {
      setTrackItem(track);
    }
  }, [router.query.trackId, eventSpace?.tracks]);

  if (isLoading) {
    return <Loader />;
  }

  return trackItem && <TrackDetailsPageTemplate trackItem={trackItem} />;
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  await queryClient.prefetchQuery('currentEventSpace', () => fetchEventSpaceById(event_space_id));
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
      dehydratedState: dehydrate(queryClient),
    },
  };
};
