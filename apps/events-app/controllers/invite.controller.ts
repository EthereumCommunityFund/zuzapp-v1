import axiosInstance from "@/src/axiosInstance";
import { InviteCreateRequestBody, InviteUpdateRequestBody } from "@/types";


export const createInvite = async (data: InviteCreateRequestBody) => {

    return await axiosInstance.post('/api/invite/createInvite', data)

}
export const updateInvite = async (data: InviteUpdateRequestBody) => {

    return await axiosInstance.post('/api/invite/updateInvite', data)

}