import { fetchInvitedEventSpaces } from '@/controllers/eventspace.controller';

export async function fetchInvitedEvents() {
  try {
    const response = await fetchInvitedEventSpaces();
    return response.data.data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
