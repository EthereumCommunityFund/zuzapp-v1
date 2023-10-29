import EventViewPageTemplate from '@/components/templates/EventViewPageTemplate';

import { Loader } from '@/components/ui/Loader';
import useEventDetails from '@/hooks/useCurrentEventSpace';
import { useGlobalContext } from '@/context/GlobalContext';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useEventSpaces } from '@/context/EventSpaceContext';
import { useQuery } from 'react-query';
import { EventSpaceDetailsType } from '@/types';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';

export default function EventViewPage(props: { user: any }) {
  // Make request to get all event spaces
  const { profile } = useGlobalContext();

  const { user } = props;

  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    [, 'event_space_id'], // Query key
    () => fetchEventSpaceById('7aa90b9a-456e-4852-bfad-ed247513b28f'),
    {
      onSuccess: (data) => {
        console.log('eventSpace:', eventSpace);
      },
      onError: (error) => {
        console.log(error, 'error loading events');
      },
    }
  );

  return <>{eventSpace && <EventViewPageTemplate eventSpace={eventSpace} user={user} />}</>;
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

  return {
    props: {
      initialSession: session,
      user: session?.user,

      // dehydratedState: dehydrate(queryClient),
    },
  };
};
