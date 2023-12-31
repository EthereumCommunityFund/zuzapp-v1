

let default_limit = 10
let default_page = 1

import axiosInstance from '../src/axiosInstance';
import { EventSpaceCreateRequestBody, EventSpaceStatusUpdateRequestBody, EventSpaceUpdateRequestBody, RouteOptions } from '../types';

// gets an event space
export const fetchEventSpace = async (id: string) => {
  return await axiosInstance.get(`/api/eventspace/${id}`);
};

// gets all event spaces created by a user
export const fetchEventSpacesByUser = async (options: RouteOptions) => {
  let limit = options.limit || default_limit;
  let page = options.page || default_page
  return await axiosInstance.get(`/api/eventspace/fetchByUser?limit=${limit}&page=${page}`);
};

export const fetchInvitedEventSpaces = async (options: RouteOptions) => {
  let limit = options.limit || default_limit;
  let page = options.page || default_page
  return await axiosInstance.get(`/api/eventspace/fetchByInvite?limit=${limit}&page=${page}`);
};

// gets publisbed event spaces
export const fetchAllEventSpaces = async (options: RouteOptions) => {
  let limit = options.limit || default_limit;
  let page = options.page || default_page
  return await axiosInstance.get(`/api/eventspace?limit=${limit}&page=${page}`);
};

// creates an event space
export const createEventSpace = async (data: EventSpaceCreateRequestBody) => {
  return await axiosInstance.post('/api/eventspace/create', data);
};

// updates an event space
export const updateEventSpace = async (id: string, data: EventSpaceUpdateRequestBody) => {
  return await axiosInstance.put(`/api/eventspace/${id}/update/?event_space_id=${id}`, data);
};
// updates an event space status
export const updateEventSpaceStatus = async (id: string, data: EventSpaceStatusUpdateRequestBody) => {
  return await axiosInstance.put(`/api/eventspace/${id}/changeStatus/?event_space_id=${id}`, data);
};

// deletes an event space
export const deleteEventSpace = async (id: string) => {
  return await axiosInstance.delete(`/api/eventspace/${id}/delete/?event_space_id=${id}`);
};
