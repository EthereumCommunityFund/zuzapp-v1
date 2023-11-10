import { DropDownMenuItemType, OrganizerType } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

import React, { useEffect, useState } from 'react';

import { QueryClient } from 'react-query';

import SessionViewPageTemplate from '@/components/templates/SessionViewPageTemplate';
import { useRouter } from 'next/router';
import useEventDetails from '@/hooks/useCurrentEventSpace';
import { Loader } from '@/components/ui/Loader';
import { fetchAllSpeakers } from '@/controllers';

export default function EventViewTracksAlleSchedulesPage() {
  const router = useRouter();
  const { event_space_id } = router.query;
  const { eventSpace } = useEventDetails();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [allSpeakers, setAllSpeakers] = useState<any[]>([]);

  const fetchSchedules = async () => {
    const allOrganizersSet: Set<string> = new Set();
    const response = await fetchAllSpeakers();
    const allOrganizers: OrganizerType[] = response.data.data;
    allOrganizers.forEach((organizer) => allOrganizersSet.add(organizer.name.trim()));
    setAllSpeakers(Array.from(allOrganizersSet));
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      fetchSchedules();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <div className='lg:pt-0 sm:pt-6'>
      {
        event_space_id && eventSpace && allSpeakers &&
        <SessionViewPageTemplate
          event_space_id={event_space_id as string}
          eventSpace={eventSpace}
          speakers={allSpeakers}
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
