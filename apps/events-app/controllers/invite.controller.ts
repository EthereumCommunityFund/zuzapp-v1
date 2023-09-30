import axiosInstance from "@/src/axiosInstance";
import { InviteCreateRequestBody, InviteUpdateRequestBody } from "@/types";


export const createInvite = async (data: InviteCreateRequestBody) => {
    return await axiosInstance.post('/api/invite/createInvite', data)
}


export const fetchInvite = async (id: string) => {
    return await axiosInstance.get(`/api/invite/${id}`);

}

export const fetchEventSpaceInvites = async (id: string) => {
    return await axiosInstance.get(`/api/invite/fetchByEventID?event_space_id=${id}`)
}

export const updateInvite = async (id: string, data: InviteUpdateRequestBody) => {
    return await axiosInstance.post(`/api/invite/${id}/update`, data)

}

export const revokeInvite = async (id: string) => {
    return await axiosInstance.post(`/api/invite/${id}/revoke`)

}