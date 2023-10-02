import { fetchSchedulesByEventSpace } from '../controllers/schedule.controller';

const fetchSchedulesByEvenSpaceId = async (id: string) => {
  try {
    const response = await fetchSchedulesByEventSpace(id);
    const data = response.data.data;
    console.log(response.data.data, 'schedulesByEvents');
    return data;
  } catch (error) {
    console.error('Error fetching track for this space:', error);
    throw error;
  }
};

export default fetchSchedulesByEvenSpaceId;
