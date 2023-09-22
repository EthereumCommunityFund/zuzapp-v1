import { LocationCreateRequestBody, LocationUpdateRequestBody } from "@/types";
import axiosInstance from "../src/axiosInstance"

export const fetchAllSpeakers = async () => {
    return await axiosInstance.get(`/api/speaker`);
}
