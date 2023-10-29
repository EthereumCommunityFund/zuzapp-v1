// create custom hook for fetching event details

import { fetchEventSpaceById } from '@/services/fetchEventSpaceDetails';
import { EventSpaceDetailsType } from '@/types';
import { isError } from 'joi';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

const useEventDetatils = (event_space_id: string) => {
  const {
    data: eventSpace,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType, Error>(
    ['currentEventSpace', event_space_id], // Query key
    () => fetchEventSpaceById(event_space_id as string),

    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {
      },
    }
  );
  return { eventSpace, isLoading, isError };
};

export default useEventDetatils;
