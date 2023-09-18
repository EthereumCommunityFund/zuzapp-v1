import TrackItem from '@/components/tracks/TrackItemCard';
import Button from '@/components/ui/buttons/Button';
import { Database } from '@/database.types';
import { TrackUpdateRequestBody } from '@/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { HiCog, HiPlusCircle, HiSelector } from 'react-icons/hi';
import { useQuery } from 'react-query';
// import { fetchTracksByEventSpaceId } from '../../services/fetchTracksByEventSpace';
import TrackItemTemplate from '@/components/tracks/TrackItemTemplate';
import { useEffect, useState } from 'react';
import { fetchTrack, fetchTracksByEventSpace } from '@/controllers/track.controller';
import fetchTracksByEventSpaceId from '../../services/fetchTracksByEventSpace';
export default function Tracks() {
  const router = useRouter();
  const { eventId } = router.query;

  const handleAddTrack = async () => {
    try {
      // Redirect to a new page with the fetched details
      router.push({
        pathname: `tracks/addtrack`,
        query: { eventId: eventId },
      });
    } catch (error) {
      console.error('Error fetching space details', error);
    }
  };

  // NOT READY YET ON API
  const {
    data: trackDetails,
    isLoading,
    isError,
  } = useQuery<TrackUpdateRequestBody, Error>(
    ['trackDetails', eventId],
    () => fetchTracksByEventSpaceId(eventId as string),

    {
      enabled: !!eventId,
    }
  );
  // const [trackDetails, setTrackDetails] = useState([]);

  // async function fetchTracks(id: string) {
  //   try {
  //     const result = await fetchTracksByEventSpace(id);
  //     console.log(result, 'result');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // fetchTracks('2e9d111e-8b0f-4677-99c9-f7945423a093');
  // useEffect(() => {
  //   const fetchTracks = async () => {
  //     const tracks = await fetchTracksByEventSpaceId(eventId);
  //     setTrackDetails(tracks);
  //     console.log(trackDetails, 'trackdetails');
  //   };
  //   fetchTracks();
  // }, [eventId]);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }
  // if (isError) {
  //   return <p>Error loading track details</p>;
  // }

  return (
    <div className="flex flex-col flex-1 items-center gap-[10px] pt-10 px-20 pb-0 self-stretch">
      <div className="flex flex-col items-center gap-[44px] self-stretch mx-auto w-[82%]">
        <div className="flex flex-col items-start gap-7 self-stretch">
          <span className="text-[50px] font-bold leading-[1.2]">Tracks</span>
          <div className="flex justify-between items-start self-stretch">
            <Button variant="light-blue" className="rounded-full font-bold" size="lg" leftIcon={BiSolidPlusCircle} onClick={handleAddTrack}>
              Add a Track
            </Button>
            <div className="flex items-start gap-3">
              <Button variant="ghost" size="base" className="font-bold opacity-70" leftIcon={HiSelector}>Sort</Button>
              <Button variant="ghost" size="base" className="font-bold opacity-70" leftIcon={HiCog}>Select</Button>
            </div>
          </div>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className='w-full'>
              {trackDetails && <TrackItemTemplate trackDetails={trackDetails} />}
            </div>
          )}
        </div>
      </div>
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
