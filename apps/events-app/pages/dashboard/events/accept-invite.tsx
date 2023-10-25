import { EventInviteCard } from '@/components/templates/events/EventInviteCard';
import { useState } from 'react';
import router, { useRouter } from 'next/router';
import { useUserPassportContext } from '@/context/PassportContext';
import { useGlobalContext } from '@/context/GlobalContext';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import { updateInvite } from '@/controllers/invite.controller';
import { useQuery } from 'react-query';
import fetchInviteById from '@/services/fetchInviteById';
import { EventSpaceDetailsType } from '@/types';
import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import useCurrentEventSpace from '@/hooks/useCurrentEventSpace';
import useEventDetatils from '@/hooks/useEvent';
import { toast } from '@/components/ui/use-toast';
import { Loader } from '@/components/ui/Loader';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function Invited() {
  const { signIn } = useUserPassportContext();
  const { isAuthenticated, user } = useGlobalContext();
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();
  const { invite_id } = router.query;
  const [eventId, setEventId] = useState('');

  const {
    data: inviteDetails,
    isLoading,
    isError,
  } = useQuery<any, Error>(['inviteDetails', invite_id], () => fetchInviteById(invite_id as string), {
    enabled: !!invite_id,
    onSuccess: (data) => {
      console.log('invite', data);
      setEventId(data?.event_space_id as string);
      if (data.status === 'accepted') {
        setAccepted(true);
      }
    },
  });

  const { eventSpace, isLoading: eventLoader } = useEventDetatils(eventId as string);

  const handleUpdateInvite = async () => {
    if (!invite_id) return;
    try {
      await updateInvite(invite_id as string, {
        status: 'accepted',
      });
      setAccepted(true);
      toast({
        title: 'Invite accepted successfully',
      });
    } catch (error) {
      console.error('Error accepting invite', error);
      setAccepted(false);

      const axiosError = error as AxiosErrorResponse;
      const errorMessage = axiosError.response?.data?.message || 'Error accepting invite';

      toast({
        title: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleButtonClick = async () => {
    router.push({
      pathname: `/dashboard/events/myspaces`,
    });
  };
  const renderEventInviteCard = () => {
    if (!user) {
      return (
        <EventInviteCard
          onButtonClick={signIn}
          spacename={eventSpace?.name as string}
          buttonTitle="Connect Passport"
          buttonVariant="quiet"
          loading={eventLoader}
          info="You need to login to accept this invitation to edit"
        />
      );
    } else if (accepted || (inviteDetails && inviteDetails.status === 'accepted')) {
      return (
        <EventInviteCard
          spacename={eventSpace?.name as string}
          buttonTitle={'My Event Spaces'}
          onButtonClick={handleButtonClick}
          buttonVariant="blue"
          info="Invite Accepted, Head to your Event Spaces to view your invited spaces"
          loading={eventLoader}
        />
      );
    } else {
      return (
        <EventInviteCard
          spacename={eventSpace?.name as string}
          onButtonClick={handleUpdateInvite}
          buttonTitle="Accept invite"
          buttonVariant="blue"
          info="Click the Button to Accept the invite"
          loading={eventLoader}
        />
      );
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

  return {
    props: {
      initialSession: session,
      user: session?.user,
    },
  };
};
