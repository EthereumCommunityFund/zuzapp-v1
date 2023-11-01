import { DropDownMenuItemType } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

import React from 'react';

import { QueryClient } from 'react-query';

import SessionViewPageTemplate from '@/components/templates/SessionViewPageTemplate';
import { useRouter } from 'next/router';
import useEventDetails from '@/hooks/useCurrentEventSpace';
import { Loader } from '@/components/ui/Loader';
import { useGlobalContext } from '@/context/GlobalContext';

export default function EventViewTracksAlleSchedulesPage() {
  const router = useRouter();
  const { event_space_id } = router.query;
  const { eventSpace, isLoading } = useEventDetails();
  const { profile, isAuthenticated } = useGlobalContext();

  if (isLoading) {
    return (
      <Loader />
    )
  }
  return (
    <div className='lg:pt-0 sm:pt-6'>
      {
        event_space_id && eventSpace &&
        <SessionViewPageTemplate
          event_space_id={event_space_id as string}
          eventSpace={eventSpace}
          isLoggedIn={!isAuthenticated}
        />
      }
    </div>
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
