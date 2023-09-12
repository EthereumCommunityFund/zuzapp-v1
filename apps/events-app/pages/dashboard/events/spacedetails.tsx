import EventLocation from '@/components/eventspace/EventLocation';
import EventSpaceDetails from '@/components/eventspace/EventSpaceDetails';
import EventSpaceDetailsNavBar from '@/components/eventspace/EventSpaceDetailsNavBar';
import Button from '@/components/ui/buttons/Button';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { HiArrowLeft } from 'react-icons/hi';

export default function EventSpaceDetailsPage() {
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
          <EventSpaceDetails />
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
