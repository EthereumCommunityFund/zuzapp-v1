import axiosInstance from '@/src/axiosInstance';
import { useQuery } from 'react-query';

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
    data: guildedMembers,
    isLoading,
    isError,
  } = useQuery<GuildedMember[]>(['guildedMembers'], fetchGuildedMembers, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { guildedMembers, isLoading, isError };
};
