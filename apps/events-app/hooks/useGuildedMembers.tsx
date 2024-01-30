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
  const fetchGuildedMembers = async () => {
    const response = await axiosInstance.get('/api/guilded');
    return response.data;
  };

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
