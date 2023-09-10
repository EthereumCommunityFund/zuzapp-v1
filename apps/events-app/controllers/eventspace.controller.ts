import axiosInstance from "../src/axiosInstance"
import { EventSpaceCreateData, EventSpaceData } from "../types"


// gets an event space
export const fetchEventSpace = async (id: string) => {
    return await axiosInstance.get(`/api/eventspace/${id}`)
}


// gets all event spaces created by a user
export const fetchEventSpacesByUser = async () => {
    return await axiosInstance.get(`/api/eventspace/fetchByUser`)
}

// gets publisbed event spaces
export const fetchAllEventSpaces = async () => {
    return await axiosInstance.get(`/api/eventspace`)
}


// creates an event space
export const createEventSpace = async (data: EventSpaceCreateData) => {
    return await axiosInstance.post('/api/eventspace/create', data)
}

// updates an event space
export const updateEventSpace = async (id: string, data: EventSpaceData) => {
    return await axiosInstance.put(`/api/eventspace/${id}/update`, data)
}


// deletes an event space
export const deleteEventSpace = async (id: string) => {
    return await axiosInstance.delete(`/api/eventspace/${id}/delete`)
}






