// create custom hook for fetching track details

import { fetchTrackById } from '@/services/fetchTrack';
import { TrackType } from '@/types';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

const useTrack = (trackId: string) => {
  const { data, isLoading, isError } = useQuery<TrackType, Error>(
    ['trackDetails', trackId], // Query key
    () => fetchTrackById(trackId as string), // Query function
    {
      enabled: !!trackId,
      refetchOnWindowFocus: false, // Only execute the query if eventId is available
    }
  );

  return { trackDetails: data, isLoading };
};

export default useTrack;
