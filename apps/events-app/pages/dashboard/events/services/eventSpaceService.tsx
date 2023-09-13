import { fetchEventSpacesByUser } from '@/controllers/eventspace.controller';

export async function fetchUserEventSpaces() {
  try {
    const response = await fetchEventSpacesByUser();
    return response.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
