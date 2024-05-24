import { toast } from '@/components/ui/use-toast';
import { fetchPublishedEventSpaces } from '@/services/fetchPublishedEvents';
import { EventSpaceDetailsType } from '@/types';
import { useQuery } from 'react-query';

export const usePublishedEvents = () => {
  const {
    data: eventSpaces,
    isLoading,
    isError,
  } = useQuery<EventSpaceDetailsType[], Error>(
    ['publishedEventSpaces'], // Query key
    () => fetchPublishedEventSpaces({ page: 1, limit: 30 }),
    {
      onError: (error) => {
        console.log(error, 'error loading events');
        toast({
          title: 'Error',
          description: 'Error loading Published Events',
          variant: 'destructive',
        });
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 5,
    }
  );
  return { eventSpaces, isLoading, isError };
};
