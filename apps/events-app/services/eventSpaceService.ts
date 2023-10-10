import { fetchEventSpacesByUser } from '@/controllers/eventspace.controller';

type RouteOptions = {
  page: number;
  limit: number
}
export async function fetchUserEventSpaces({ page, limit }: RouteOptions) {
  try {
    const response = await fetchEventSpacesByUser({ page, limit });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
