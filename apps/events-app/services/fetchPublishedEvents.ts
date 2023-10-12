import { fetchAllEventSpaces } from '@/controllers/eventspace.controller';
import { RouteOptions } from '@/types';

export async function fetchPublishedEventSpaces({ page, limit }: RouteOptions) {
  try {
    const response = await fetchAllEventSpaces({ page, limit });
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
