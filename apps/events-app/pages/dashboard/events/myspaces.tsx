import EventSpacesTemplate from '@/components/templates/events/EventSpacesTemplate';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { fetchUserEventSpaces } from '../../../services/eventSpaceService';
import { EventSpaceDetailsType } from '@/types';
import { useQuery } from 'react-query';
import { fetchInvitedEvents } from '@/services/fetchInvitedEvents';

export default function MyEventSpacesPage() {
  const {
    data: eventSpaces,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType[], Error>(
    ['eventSpaces'], // Query key
    () => {
      return fetchUserEventSpaces({ page: 1, limit: 10 });
    },

    {
      onSuccess: (data) => {},
    }
  );

  const { data: invitedSpaces, isLoading: invitedSpacesLoading } = useQuery<EventSpaceDetailsType[], Error>(
    ['invitedSpaces'], // Query key
    () => fetchInvitedEvents({ limit: 10, page: 1 }),
    {
      onSuccess: (data) => {},
    }
  );

  if (isError) {
    return <p>Error loading space details</p>;
  }
  return (
    <div className="flex gap-[10px] flex-1 items-center self-stretch font-inter">
      {<EventSpacesTemplate eventSpaces={eventSpaces} invitedSpaces={invitedSpaces} isLoading={isLoading} invitedSpacesLoading={invitedSpacesLoading} />}
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
