import EventSpacesTemplate from '@/components/templates/events/EventSpacesTemplate';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { fetchUserEventSpaces } from './eventSpaceService';
import { EventSpaceDetailsType } from '@/types';

export default function MyEventSpacesPage() {
  // Make request to get all event spaces
  const [eventSpaces, setEventSpaces] = useState<EventSpaceDetailsType[]>([]);

  useEffect(() => {
    const fetchEventSpaces = async () => {
      try {
        const eventSpaceDetails = await fetchUserEventSpaces();
        setEventSpaces(eventSpaceDetails);
        console.log(eventSpaces, 'eventSpaces');
      } catch (error) {
        console.log(error);
      }
    };

    fetchEventSpaces();
  }, []);
  return (
    <div className="flex gap-[10px] flex-1 items-center self-stretch">
      <EventSpacesTemplate eventSpaces={eventSpaces} />
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
