import { fetchTrack } from '@/controllers';

export async function fetchTrackById(id: string) {
  try {
    const response = await fetchTrack(id);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching track:', error);
    throw error;
  }
}
