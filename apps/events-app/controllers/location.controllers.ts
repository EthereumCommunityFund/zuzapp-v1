
import axiosInstance from "../src/axiosInstance"

// EventSpaceLocation Controller Functions

export const fetchEventSpaceLocation = async (id: string) => {
    return await axiosInstance.get(`/api/eventspacelocation/${id}`);
}

export const fetchLocationsByEventSpace = async (eventSpaceId: string) => {
    return await axiosInstance.get(`/api/eventspacelocation/fetchByEventSpace/${eventSpaceId}`);
}

export const createEventSpaceLocation = async (data: any) => {
    return await axiosInstance.post('/api/eventspacelocation/create', data);
}

export const updateEventSpaceLocation = async (id: string, data: any) => {
    return await axiosInstance.put(`/api/eventspacelocation/${id}/update`, data);
}

export const deleteEventSpaceLocation = async (id: string) => {
    return await axiosInstance.delete(`/api/eventspacelocation/${id}/delete`);
}
