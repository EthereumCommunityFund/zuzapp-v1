import { fetchAllEventSpaces } from '@/controllers/eventspace.controller';

export async function fetchPublishedEventSpaces() {
  try {
    const response = await fetchAllEventSpaces();
    return response?.data?.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
