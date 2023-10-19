import { fetchScheduleByID } from '../controllers/schedule.controller';

const fetchScheduleById = async (id: string) => {
  try {
    const response = await fetchScheduleByID(id);
    console.log(response, 'scheduleresponse');
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error('Error fetching track for this space:', error);
    throw error;
  }
};

export default fetchScheduleById;
