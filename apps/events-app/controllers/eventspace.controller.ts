import axiosInstance from "../src/axiosInstance"
import { EventSpaceCreateData, EventSpaceUpdateData } from "../types"

export const createEventSpace = async (data: EventSpaceCreateData) => {
    return await axiosInstance.post('/api/eventspace/create', data)
}

export const updateEventSpace = async (id: string, data: EventSpaceUpdateData) => {
    return await axiosInstance.put(`/api/eventspace/${id}/update`, data)
}

export const fetchEventSpace = async (id: string) => {
    return await axiosInstance.get(`/api/eventspace/${id}`)
}
export const deleteEventSpace = async (id: string) => {
    return await axiosInstance.delete(`/api/eventspace/${id}/delete`)
}



