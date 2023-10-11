import { fetchInvitedEventSpaces } from '@/controllers/eventspace.controller';
import { RouteOptions } from '@/types';

export async function fetchInvitedEvents({ limit, page }: RouteOptions) {
  try {
    const response = await fetchInvitedEventSpaces({ limit, page });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
