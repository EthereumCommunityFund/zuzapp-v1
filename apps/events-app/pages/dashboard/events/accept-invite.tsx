import { EventInviteCard } from '@/components/templates/events/EventInviteCard';
import { useState } from 'react';
import router, { useRouter } from 'next/router';
import { useUserPassportContext } from '@/context/PassportContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { updateInvite } from '@/controllers/invite.controller';

export default function Invited() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();
  const { invite_id } = router.query;

  const handleUpdateInvite = async () => {
    if (!invite_id) return;
    setAccepted(true);
    try {
      await updateInvite({
        invite_id: invite_id as string,
        status: 'accepted',
      });
    } catch (error) {
      console.error('Error sending invite', error);
    }
  };

  const handleButtonClick = async () => {
    router.push({
      pathname: `/dashboard/events/myspaces`,
    });
  };

  const renderEventInviteCard = () => {
    if (user) {
      if (accepted) {
        return (
          <EventInviteCard spacename="ZuConnect" buttonTitle="My Event Spaces" onButtonClick={handleButtonClick} buttonVariant="blue" info="Head to your Event Spaces to view your invited spaces" />
        );
      } else {
        return <EventInviteCard spacename="ZuConnect" onButtonClick={handleUpdateInvite} buttonTitle="Accept invite" buttonVariant="blue" info="Click the Button to Accept the invite" />;
      }
    } else {
      return <EventInviteCard onButtonClick={signIn} spacename="ZuConnect" buttonTitle="Connect Passport" buttonVariant="quiet" info="You need to login to accept this invitation to edit" />;
    }
  };

  return <div className="flex items-center justify-center">{renderEventInviteCard()}</div>;
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
