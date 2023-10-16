import axiosInstance from '../src/axiosInstance';

export const updateUsername = async (data: { username: string }) => {
    return await axiosInstance.put('/api/profile/updateUsername', data);
}