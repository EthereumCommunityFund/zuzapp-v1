import { TrackCreateRequestBody, TrackUpdateRequestBody } from "@/types";
import axiosInstance from "../src/axiosInstance"
// Track Controller Functions

export const fetchTrack = async (id: string) => {
    return await axiosInstance.get(`/api/track/${id}`);
}

export const fetchTracksByEventSpace = async (event_space_id: string) => {
    return await axiosInstance.get(`/api/track/fetchByEventID/?event_space_id=${event_space_id}`);
}

export const createTrack = async (data: TrackCreateRequestBody, event_space_id: string) => {
    return await axiosInstance.post(`/api/track/create/?event_space_id=${event_space_id}`, data);
}

export const updateTrack = async (id: string, data: TrackUpdateRequestBody, event_space_id: string) => {
    return await axiosInstance.put(`/api/track/${id}/update/?event_space_id=${event_space_id}`, data);
}

export const deleteTrack = async (id: string, event_space_id: string) => {
    return await axiosInstance.delete(`/api/track/${id}/delete/?event_space_id=${event_space_id}`);
}
