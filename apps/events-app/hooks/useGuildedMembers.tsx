import axiosInstance from '@/src/axiosInstance';
import { useQuery } from 'react-query';

type GuildedMembersResponse = {
  members: GuildedMember[];
};

export type GuildedRole = {
  colors: number[];
  createdAt: string;
  id: number;
  isBase: boolean;
  isDisplayedSeparately: boolean;
  isMentionable: boolean;
  isSelfAssignable: boolean;
  name: string;
  permissions: string[];
  position: number;
  priority: number;
  serverId: string;
  updatedAt: string;
};

export type GuildedMember = {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  roleIds: number[];
  roles: GuildedRole[];
};

const fetchGuildedMembers = async () => {
  const response = await axiosInstance.get('/api/guilded');
  return response.data;
};

export const useGuildedMembers = () => {
  const {
    data: guildedMembersResponse,
    isLoading,
    isError,
  } = useQuery<GuildedMembersResponse>(['guildedMembers'], fetchGuildedMembers, {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return { guildedMembers: guildedMembersResponse?.members ?? [], isLoading, isError };
};
