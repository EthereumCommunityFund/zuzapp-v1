import { deleteSchedule } from '@/controllers/schedule.controller';

export async function deleteScheduleById(id: string, event_space_id: string) {
  try {
    const response = await deleteSchedule(id, event_space_id);
    return response;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
}
