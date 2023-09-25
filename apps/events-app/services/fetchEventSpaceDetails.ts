import { fetchEventSpace } from '@/controllers/eventspace.controller';

export async function fetchEventSpaceById(id: string) {
  try {
    const response = await fetchEventSpace(id);
    const data = response?.data?.data;
    return data;
  } catch (error) {
    console.error('Error fetching event spaces:', error);
    throw error;
  }
}
