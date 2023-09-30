import axiosInstance from "@/src/axiosInstance";
import { InviteCreateRequestBody, InviteUpdateRequestBody } from "@/types";


export const createInvite = async (data: InviteCreateRequestBody, event_space_id: string) => {
    return await axiosInstance.post(`/api/invite/createInvite/?event_space_id=${event_space_id}`, data)
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

export const revokeInvite = async (id: string, event_space_id: string) => {
    return await axiosInstance.post(`/api/invite/${id}/revoke/event_space_id=${event_space_id}`)

}