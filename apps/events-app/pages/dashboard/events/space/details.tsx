import EventSpaceDetails from '@/components/eventspace/EventSpaceDetails';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useQuery } from 'react-query';

import { Loader } from '@/components/ui/Loader';
import useCurrentEventSpace from '@/hooks/useCurrentEventSpace';

export default function EventSpaceDetailsPage() {
  const router = useRouter();
  const goBackToPreviousPage = () => {
    router.back();
  };

  const { eventSpace, isLoading, isError } = useCurrentEventSpace();
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>Error loading space details</p>;
  }
  return <>{eventSpace && <EventSpaceDetails eventSpace={eventSpace} isLoadingEvent={isLoading} handleGoBack={goBackToPreviousPage} />}</>;
}

export const getServerSideProps = async (ctx: any) => {
  const queryClient = new QueryClient();
  // const { event_space_id } = ctx.query;
  // await queryClient.prefetchQuery("currentEventSpace", () =>
  //   fetchEventSpaceById(event_space_id)
  // );
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
