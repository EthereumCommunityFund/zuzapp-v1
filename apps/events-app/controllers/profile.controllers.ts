import axiosInstance from '../src/axiosInstance';

export const updateUsername = async (data: { username: string }) => {
    return await axiosInstance.put('/api/profile/updateUsername', data);
}


export const fetchProfile = async () => {
    return await axiosInstance.get('/api/profile');
}