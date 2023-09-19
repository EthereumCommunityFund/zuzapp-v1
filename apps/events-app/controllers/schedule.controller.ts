

import { ScheduleCreateRequestBody, ScheduleUpdateRequestBody } from "@/types";
import axiosInstance from "../src/axiosInstance"


// Gets a schedule by ID
export const fetchSchedule = async (id: string) => {
    return await axiosInstance.get(`/api/schedule/${id}`);
}

// Gets all schedules related to an event space
export const fetchSchedulesByEventSpace = async (eventSpaceId: string) => {
    return await axiosInstance.get(`/api/schedule/fetchByEventID/?event_space_id=${eventSpaceId}`);
}

// Gets all schedules related to an event space
export const fetchSchedulesByTrack = async (trackID: string) => {
    return await axiosInstance.get(`/api/schedule/fetchByTrackID/?track_id=${trackID}`);
}


// Gets all schedules related to an event space
export const fetchScheduleByID = async (id: string) => {
    return await axiosInstance.get(`/api/schedule/${id}`);
}

// Creates a new schedule
export const createSchedule = async (data: ScheduleCreateRequestBody) => {
    return await axiosInstance.post('/api/schedule/create', data);
}

// Updates a schedule
export const updateSchedule = async (id: string, data: ScheduleUpdateRequestBody) => {
    return await axiosInstance.put(`/api/schedule/${id}/update`, data);
}

// // Deletes a schedule
// export const deleteSchedule = async (id: string) => {
//     return await axiosInstance.delete(`/api/schedule/${id}/delete`);
// }
