import { fetchInvite } from '../controllers/invite.controller';

const fetchInviteById = async (id: string) => {
  try {
    const response = await fetchInvite(id);
    console.log(response, 'inviteresponse');
    const data = response.data.data;
    console.log(response, 'invitedata');
    return data;
  } catch (error) {
    console.error('Error fetching invites for this space:', error);
    throw error;
  }
};

export default fetchInviteById;
