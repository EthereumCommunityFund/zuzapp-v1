import axiosInstance from '@/src/axiosInstance';
import { useQuery } from 'react-query';

type GuildedMembersResponse = {
  members: GuildedMember[];
};

type GuildedMember = {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  roleIds: number[];
};

const fetchGuildedMembers = async () => {
  const response = await axiosInstance.get('/api/guilded/');
  return response.data;
};

export const useGuildedMembers = () => {
  const {
    data: guildedMembersResponse,
    isLoading,
    isError,
  } = useQuery<GuildedMembersResponse>(['guildedMembers'], fetchGuildedMembers, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { guildedMembers: guildedMembersResponse?.members ?? [], isLoading, isError };
};
