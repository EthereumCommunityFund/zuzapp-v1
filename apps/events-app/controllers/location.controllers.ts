
import axiosInstance from "../src/axiosInstance"

// Deletes a location
export const deleteLocation = async (id: string) => {
    return await axiosInstance.get(`/api/location/${id}/delete`)
}
