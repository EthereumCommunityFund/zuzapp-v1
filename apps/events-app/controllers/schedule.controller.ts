import { ScheduleCreateRequestBody, ScheduleUpdateRequestBody } from '@/types';
import axiosInstance from '../src/axiosInstance';

// Gets a schedule by ID
export const fetchSchedule = async (id: string) => {
  return await axiosInstance.get(`/api/schedule/${id}`);
};

// Gets all schedules related to an event space
export const fetchSchedulesByEventSpace = async (eventSpaceId: string) => {
  return await axiosInstance.get(`/api/schedule/fetchByEventID/?event_space_id=${eventSpaceId}`);
};

// Gets all schedules related to an event space
export const fetchSchedulesByTrack = async (trackID: string) => {
  return await axiosInstance.get(`/api/schedule/fetchByTrackID/?track_id=${trackID}`);
};
// Gets all schedules related to an event space
export const fetchSchedulesByUserRsvp = async () => {
  return await axiosInstance.get(`/api/schedule/fetchByRsvp`);
};

// Gets all schedules related to an event space
export const fetchScheduleByID = async (id: string) => {
  return await axiosInstance.get(`/api/schedule/${id}`);
};

// Creates a new schedule
export const createSchedule = async (data: ScheduleCreateRequestBody, event_space_id: string) => {
  return await axiosInstance.post(`/api/schedule/create/?event_space_id=${event_space_id}`, data);
};

// Updates a schedule
export const updateSchedule = async (id: string, data: ScheduleUpdateRequestBody, event_space_id: string) => {
  return await axiosInstance.put(`/api/schedule/${id}/update/?event_space_id=${event_space_id}`, data);
};

// Deletes a schedule
export const deleteSchedule = async (id: string, event_space_id: string) => {
  return await axiosInstance.delete(`/api/schedule/${id}/delete/?event_space_id=${event_space_id}`);
};

// RSVP a schedule
export const rsvpSchedule = async (id: string, event_space_id: string) => {
  return await axiosInstance.put(`/api/schedule/${id}/rsvp/?event_space_id=${event_space_id}`);
};

// RSVP a schedule
export const checkUserRsvpBySchedule = async (id: string, event_space_id: string) => {
  return await axiosInstance.put(`/api/schedule/${id}/checkUserRsvp/?event_space_id=${event_space_id}`);
};

// RSVP a schedule
export const cancelUserRsvpBySchedule = async (id: string, event_space_id: string) => {
  return await axiosInstance.put(`/api/schedule/${id}/cancelUserRsvp/?event_space_id=${event_space_id}`);
};
