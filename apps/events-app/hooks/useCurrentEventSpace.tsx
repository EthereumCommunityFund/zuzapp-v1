// create custom hook for fetching event details

import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import { EventSpaceDetailsType } from '@/types';
import { isError } from 'joi';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

const useCurrentEventSpace = () => {
  const router = useRouter();
  const { event_space_id } = router.query;

  const {
    data: eventSpace,
    isLoading,
    isError,
    refetch,
  } = useQuery<EventSpaceDetailsType, Error>(
    ['currentEventSpace', event_space_id], // Query key
    () => fetchEventSpaceById(event_space_id as string),

    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {},
    }
  );
  return { eventSpace, isLoading, isError, refetch };
};

export default useCurrentEventSpace;
