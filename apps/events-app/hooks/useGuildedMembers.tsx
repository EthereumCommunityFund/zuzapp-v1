import axiosInstance from '@/src/axiosInstance';
import { useEffect, useState } from 'react';
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

export const useGuildedMembers = () => {
  const [guildedMembersResponse, setGuilded] = useState<GuildedMembersResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const fetchGuildedMembers = async () => {
    setIsLoading(true);
    const response = await axiosInstance.get('/api/guilded');
    setGuilded(response.data);
    setIsLoading(false);
  };

  // const {
  //   data: guildedMembersResponse,
  //   isLoading,
  //   isError,
  // } = useQuery<GuildedMembersResponse>(['guildedMembers'], fetchGuildedMembers, {
  //   refetchOnWindowFocus: true,
  //   refetchOnReconnect: true,
  // });

  useEffect(() => {
    fetchGuildedMembers();
  }, []);

  return { guildedMembers: guildedMembersResponse?.members ?? [], isLoading };
};
