import HomePageTemplate from '@/components/templates/HomePageTemplate';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { useEventSpaces } from '@/context/EventSpaceContext';
import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

export default function DashboardHomePage(props: { profile: any }) {
  const { profile } = props;
  console.log(profile, 'profile');
  const result = useEventSpaces();
  return (
    <>
      <HomePageTemplate />
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
