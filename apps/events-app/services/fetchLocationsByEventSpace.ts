import { fetchLocationsByEventSpace } from '@/controllers';

const fetchLocationsByEventSpaceId = async (id: string) => {
  try {
    const response = await fetchLocationsByEventSpace(id);
    console.log(response, 'trackresponse');
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error('Error fetching track for this space:', error);
    throw error;
  }
};

export default fetchLocationsByEventSpaceId;
