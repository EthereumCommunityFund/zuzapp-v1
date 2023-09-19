
import { LocationCreateRequestBody, LocationUpdateRequestBody } from "@/types";
import axiosInstance from "../src/axiosInstance"

// EventSpaceLocation Controller Functions

// export const fetchEventSpaceLocation = async (id: string) => {
//     return await axiosInstance.get(`/api/location/${id}`);
// }

export const fetchLocationsByEventSpace = async (eventSpaceId: string) => {
    return await axiosInstance.get(`/api/location/fetchByEventID/?event_space_id=${eventSpaceId}`);
}

export const createEventSpaceLocation = async (data: LocationCreateRequestBody) => {
    return await axiosInstance.post('/api/location/create', data);
}

export const updateEventSpaceLocation = async (id: string, data: LocationUpdateRequestBody) => {
    return await axiosInstance.put(`/api/location/${id}/update`, data);
}

export const deleteEventSpaceLocation = async (id: string) => {
    return await axiosInstance.delete(`/api/location/${id}/delete`);
}
