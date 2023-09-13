import EventLocation from '@/components/eventspace/EventLocation';
import EventSpaceDetails from '@/components/eventspace/EventSpaceDetails';
import EventSpaceDetailsNavBar from '@/components/eventspace/EventSpaceDetailsNavBar';
import Button from '@/components/ui/buttons/Button';

import { EventSpaceDetailsType } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';

import { HiArrowLeft } from 'react-icons/hi';

import { fetchEventSpaceById } from './services/fetchEventSpaceDetails';

export default function EventSpaceDetailsPage() {
  const router = useRouter();
  const { eventId } = router.query;

  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    ['spaceDetails', eventId], // Query key
    () => fetchEventSpaceById(eventId as string), // Query function
    {
      enabled: !!eventId, // Only execute the query if eventId is available
    }
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error loading space details</p>;
  }
  return (
    <div className="flex py-5 px-10 flex-col flex-1 items-center gap-[10px] self-stretch">
      <div className="flex items-start gap-8 self-stretch">
        <EventSpaceDetailsNavBar />
        <div className="flex flex-col px-5 gap-5 justify-center items-start flex-1">
          <Link href={'spacedashboard'}>
            <Button leftIcon={HiArrowLeft} variant="light-dark">
              Back
            </Button>
          </Link>
          {eventSpace && <EventSpaceDetails eventSpace={eventSpace} />}
          <EventLocation />
        </div>
      </div>
    </div>
  );
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

  // get profile from session
  const { data: profile, error } = await supabase.from('profile').select('*').eq('uuid', session.user.id);

  return {
    props: {
      initialSession: session,
      user: session?.user,
      profile: profile,
    },
  };
};
