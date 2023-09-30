import axiosInstance from '../src/axiosInstance';
import { EventSpaceCreateRequestBody, EventSpaceStatusUpdateRequestBody, EventSpaceUpdateRequestBody } from '../types';

// gets an event space
export const fetchEventSpace = async (id: string) => {
  return await axiosInstance.get(`/api/eventspace/${id}`);
};

// gets all event spaces created by a user
export const fetchEventSpacesByUser = async () => {
  return await axiosInstance.get(`/api/eventspace/fetchByUser`);
};

export const fetchInvitedEventSpaces = async () => {
  return await axiosInstance.get(`/api/eventspace/fetchByInvite`);
};

// gets publisbed event spaces
export const fetchAllEventSpaces = async () => {
  return await axiosInstance.get(`/api/eventspace`);
};

// creates an event space
export const createEventSpace = async (data: EventSpaceCreateRequestBody) => {
  return await axiosInstance.post('/api/eventspace/create', data);
};

// updates an event space
export const updateEventSpace = async (id: string, data: EventSpaceUpdateRequestBody, event_space_id: string) => {
  return await axiosInstance.put(`/api/eventspace/${id}/update/?event_space_id=${id}`, data);
};
// updates an event space status
export const updateEventSpaceStatus = async (id: string, data: EventSpaceStatusUpdateRequestBody) => {
  return await axiosInstance.put(`/api/eventspace/${id}/changeStatus`, data);
};

// deletes an event space
export const deleteEventSpace = async (id: string) => {
  return await axiosInstance.delete(`/api/eventspace/${id}/delete/?event_space_id=${id}`);
};
