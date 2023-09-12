

import { ScheduleType } from "@/types";
import axiosInstance from "../src/axiosInstance"


// Gets a schedule by ID
export const fetchSchedule = async (id: string) => {
    return await axiosInstance.get(`/api/schedule/${id}`);
}

// Gets all schedules related to an event space
export const fetchSchedulesByEventSpace = async (eventSpaceId: string) => {
    return await axiosInstance.get(`/api/schedule/fetchByEventSpace/${eventSpaceId}`);
}

// Creates a new schedule
export const createSchedule = async (data: ScheduleType) => {
    return await axiosInstance.post('/api/schedule/create', data);
}

// Updates a schedule
export const updateSchedule = async (id: string, data: any) => {
    return await axiosInstance.put(`/api/schedule/${id}/update`, data);
}

// Deletes a schedule
export const deleteSchedule = async (id: string) => {
    return await axiosInstance.delete(`/api/schedule/${id}/delete`);
}
