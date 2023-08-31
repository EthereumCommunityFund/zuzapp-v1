import axiosInstance from "../src/axiosInstance"

interface EventSpaceCreateData {
    name: string;
    event_space_type: 'tracks' | 'schedules';

}


export const createEventSpace = async (data: EventSpaceCreateData) => {
    return await axiosInstance.post('/api/eventspace/create', data)
}

interface EventSpaceUpdateData {
    name: string;
    event_space_type: "tracks" | "schedules",
    start_date: number;
    end_date: number;
    description: string;
    format: "in-person" | "online" | "hybrid";
    event_type: string[];
    experience_level: string[];
    status: "draft" | "published" | "archived"
}

export const updateEventSpace = async (id: string, data: EventSpaceUpdateData) => {

    return await axiosInstance.put(`/api/eventspace/${id}/update`, data)
}