import { fetchEventSpaceInvites } from '../controllers/invite.controller';

const fetchSpaceInvites = async (id: string) => {
  try {
    const response = await fetchEventSpaceInvites(id);
    const data = response.data.data;
    console.log(response.data.data, 'space invites');
    return data;
  } catch (error) {
    console.error('Error fetching invites for this space:', error);
    throw error;
  }
};

export default fetchSpaceInvites;
