import { deleteEventSpace } from '@/controllers/eventspace.controller';

export async function deleteEventSpaceById(id: string) {
  try {
    const response = await deleteEventSpace(id);
    return response;
  } catch (error) {
    console.error('Error deleting event space:', error);
    throw error;
  }
}
