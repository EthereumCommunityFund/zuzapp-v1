import EventLocation from '@/components/eventspace/EventLocation';
import EventSpaceDetails from '@/components/eventspace/EventSpaceDetails';
import EventSpaceDetailsNavBar from '@/components/eventspace/EventSpaceDetailsNavBar';
import Button from '@/components/ui/buttons/Button';

import { EventSpaceDetailsType } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useQuery } from 'react-query';
import { HiArrowLeft } from 'react-icons/hi';

import { fetchEventSpaceById } from '../../../../services/fetchEventSpaceDetails';
import { Loader } from '@/components/ui/Loader';
import { arrayFromLength } from '@/lib/helper';
import { DetailsFormSkeleton } from '@/components/commons/DetailsFormSkeleton';
import useCurrentEventSpace from '@/hooks/useCurrentEventSpace';

export default function EventSpaceDetailsPage() {
  const router = useRouter();
  // const { eventSpace } = useEventSpace();
  const goBackToPreviousPage = () => {
    router.back();
  };

  const { eventSpace, isLoading, isError } = useCurrentEventSpace();
  console.log(isLoading, 'isloading');
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>Error loading space details</p>;
  }
  return (
    <>
      {eventSpace && <EventSpaceDetails eventSpace={eventSpace} handleGoBack={goBackToPreviousPage} />}
    </>
  );
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
