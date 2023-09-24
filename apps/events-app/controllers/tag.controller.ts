import { LocationCreateRequestBody, LocationUpdateRequestBody } from '@/types';
import axiosInstance from '../src/axiosInstance';

export const fetchAllTags = async () => {
  return await axiosInstance.get(`/api/tag`);
};
