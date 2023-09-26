import { useState } from 'react';
import Button from '@/components/ui/buttons/Button';
import { deleteEventSpaceById } from '@/services/deleteEventSpaces';
import { useEventSpace } from '@/context/EventSpaceContext';
import { useRouter } from 'next/router';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';

const EventSpaceSettings = () => {
  const { eventSpace } = useEventSpace();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteEventSpace = async () => {
    if (!eventSpace) return;

    setIsLoading(true);
    try {
      await deleteEventSpaceById(eventSpace.id as string);
      router.push('/dashboard/events/myspaces');
    } catch (error) {
      console.error('Error deleting the event space', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-[10px] flex-1 items-center self-stretch font-inter">
      <h1>Delete this event space</h1>
      <Button className="rounded-full flex justify-center" variant="red" size="lg" type="button" onClick={handleDeleteEventSpace} disabled={isLoading}>
        {isLoading ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
};

export default EventSpaceSettings;

export const getServerSideProps = async (ctx: any) => {
  const supabase = createPagesServerClient<Database>(ctx);
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
