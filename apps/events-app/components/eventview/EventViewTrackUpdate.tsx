import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/database.types';
import EditTrackForm from '@/components/tracks/EditTrackForm';
import Container from '@/components/ui/Container';
import { TrackUpdateRequestBody } from '@/types';
import { updateTrack } from '@/controllers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '@/components/ui/buttons/Button';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';
import { useQueryClient, useQuery } from 'react-query';
import { fetchTrackById } from '@/services/fetchTrack';
import { cn } from '@/lib/utils';
import { Loader } from '../ui/Loader';

interface IUpdate {
  className?: string;
}

export default function EventViewTrackUpdate({ className }: IUpdate) {
  const [trackCreated, setTrackCreated] = useState(false);
  const router = useRouter();
  const { event_space_id, trackId } = router.query;

  const queryClient = useQueryClient();
  // const queryClient = new QueryClient({
  //   defaultOptions: {
  //     queries: {
  //       refetchOnWindowFocus: false, // default: true
  //     },
  //   },
  // })

  const {
    data: trackDetails,
    isLoading,
    isError,
  } = useQuery<TrackUpdateRequestBody, Error>(
    ['trackDetails', trackId], // Query key
    () => fetchTrackById(trackId as string), // Query function
    {
      enabled: !!trackId,
      refetchOnWindowFocus: false, // Only execute the query if event_space_id is available
    }
  );

  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <p>Error loading space details</p>;
  }

  const handleTrackSubmit = async (values: TrackUpdateRequestBody) => {
    try {
      if (!event_space_id) return;
      const result = await updateTrack(
        trackId as string,
        {
          ...values,
          event_space_id: event_space_id as string,
          id: trackId as string,
        },
        event_space_id as string
      );
      setTrackCreated(true);
      console.log(result);
      queryClient.invalidateQueries({ queryKey: ['trackDetails'] });
    } catch (error) {
      setTrackCreated(false);
      console.error(error);
    }
  };

  return (
    <div className={cn('flex flex-col py-5 md:px-10 items-center gap-[10px] self-stretch w-full', className)}>
      {trackCreated ? (
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-xl">Your Track Has Been Updated</h3>
          <Link href={`/dashboard/eventview/tracks?event_space_id=${event_space_id}`}>
            <Button variant="primary" className="mt-8 bg-[#67DBFF]/20 text-[#67DBFF] rounded-full" leftIcon={HiArrowRight}>
              Go to tracks
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Container className="mx-auto max-w-screen-xl w-full">
            <EditTrackForm onTrackSubmit={handleTrackSubmit as any} trackDetails={trackDetails as TrackUpdateRequestBody} />
          </Container>
        </>
      )}
    </div>
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
