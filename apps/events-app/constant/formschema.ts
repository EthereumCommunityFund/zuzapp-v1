import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Event Name is required.',
  }),
  format: z.enum(['in-person', 'online'], {
    required_error: 'You need to select an event type.',
  }),
  start_date: z.date({
    required_error: 'You need to select a valid date for this event.',
    invalid_type_error: 'You need to select a valid date for this event.',
  }),
  end_date: z.date({
    required_error: 'You need to select a valid date for this event.',
    invalid_type_error: 'You need to select a valid date for this event.',
  }),
  description: z.string().min(5, {
    message: 'Description is required and is a minimum of 5 characters',
  }),
  locationName: z.string().min(2, {
    message: 'Main Location Name is required',
  }),
  locationAddress: z.string().min(2, {
    message: 'Main Location Address is required',
  }),
  locationCapacity: z.number().min(1, {
    message: 'Main Location Capacity is required',
  }),
  locationDescription: z.string().min(5, {
    message: 'Main Location Description is a minimum of 5 characters',
  }),
});
