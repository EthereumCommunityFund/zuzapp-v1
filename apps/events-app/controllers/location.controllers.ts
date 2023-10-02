
import { LocationCreateRequestBody, LocationUpdateRequestBody } from "@/types";
import axiosInstance from "../src/axiosInstance"

// EventSpaceLocation Controller Functions

// export const fetchEventSpaceLocation = async (id: string) => {
//     return await axiosInstance.get(`/api/location/${id}`);
// }

export const fetchLocationsByEventSpace = async (eventSpaceId: string) => {
    return await axiosInstance.get(`/api/location/fetchByEventID/?event_space_id=${eventSpaceId}`);
}

export const createEventSpaceLocation = async (data: LocationCreateRequestBody, event_space_id: string) => {
    return await axiosInstance.post(`/api/location/create/?event_space_id=${event_space_id}`, data);
}

export const updateEventSpaceLocation = async (id: string, data: LocationUpdateRequestBody, event_space_id: string) => {
    return await axiosInstance.put(`/api/location/${id}/update/?event_space_id=${event_space_id}`, data);
}

export const deleteEventSpaceLocation = async (id: string, event_space_id: string) => {
    return await axiosInstance.delete(`/api/location/${id}/delete/?event_space_id=${event_space_id}`);
}
