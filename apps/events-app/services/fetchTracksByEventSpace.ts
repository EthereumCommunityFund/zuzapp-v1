import { fetchTracksByEventSpace } from '@/controllers/track.controller';

const fetchTracksByEventSpaceId = async (id: string) => {
  try {
    const response = await fetchTracksByEventSpace(id);
    console.log(response, 'trackresponse');
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching track for this space:', error);
    throw error;
  }
};

export default fetchTracksByEventSpaceId;
