import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { QueryClient, useQuery } from 'react-query';
import { DropDownMenuItemType, EventSpaceDetailsType, TrackUpdateRequestBody } from '@/types';
import { Loader } from '@/components/ui/Loader';

import SessionViewPageTemplate from '@/components/templates/SessionViewPageTemplate';
import { toast } from '@/components/ui/use-toast';
import { useGlobalContext } from '@/context/GlobalContext';

export default function EventViewTracksAlleSchedulesPage() {
  const event_space_id = '873f2ae3-bcab-4a30-8b99-cb5e011a9db0';
  const { profile, isAuthenticated } = useGlobalContext();
  console.log('isAuthenticated', isAuthenticated, profile);
  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    ['eventSpace'], // Query key
    () => fetchEventSpaceById(event_space_id),
    {
      onSuccess: (data) => {
      },
      onError: (error) => {
        console.log(error, 'error loading events');
        toast({
          title: 'Error',
          description: 'Error loading Zuconnect EventSpace',
          variant: 'destructive',
        });
      },
    }
  );

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      {
        eventSpace &&
        <SessionViewPageTemplate
          event_space_id={event_space_id}
          eventSpace={eventSpace}
          isLoggedIn={!isAuthenticated}
        />
      }
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  const { event_space_id } = ctx.query;
  // await queryClient.prefetchQuery('currentEventSpace', () => fetchEventSpaceById(event_space_id));
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

      // dehydratedState: dehydrate(queryClient),
    },
  };
};
