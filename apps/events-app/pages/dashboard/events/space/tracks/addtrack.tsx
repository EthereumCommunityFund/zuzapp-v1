import AddTrackTemplate from '@/components/tracks/AddTrackTemplate';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';

export default function AddTrack() {
  return (
    <>
      <AddTrackTemplate />
    </>
  );
}

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
