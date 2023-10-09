
import { fetchSchedulesByTrack } from '../controllers/schedule.controller';

const fetchSchedulesByTrackId = async (id: string) => {
  try {
    const response = await fetchSchedulesByTrack(id);
    console.log(response, 'trackresponse');
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error('Error fetching track for this space:', error);
    throw error;
  }
};

export default fetchSchedulesByTrackId;
