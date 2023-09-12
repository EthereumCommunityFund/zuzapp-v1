import { TrackType } from "@/types";
import axiosInstance from "../src/axiosInstance"
// Track Controller Functions

export const fetchTrack = async (id: string) => {
    return await axiosInstance.get(`/api/track/${id}`);
}

export const fetchTracksByEventSpace = async (eventSpaceId: string) => {
    return await axiosInstance.get(`/api/track/fetchByEventSpace/${eventSpaceId}`);
}

export const createTrack = async (data: TrackType) => {
    return await axiosInstance.post('/api/track/create', data);
}

export const updateTrack = async (id: string, data: TrackType) => {
    return await axiosInstance.put(`/api/track/${id}/update`, data);
}

export const deleteTrack = async (id: string) => {
    return await axiosInstance.delete(`/api/track/${id}/delete`);
}
