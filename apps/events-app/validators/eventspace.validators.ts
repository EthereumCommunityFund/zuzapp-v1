import Joi, { boolean } from 'joi';
import { EventSpaceCreateRequestBody, EventSpaceStatusUpdateRequestBody, EventSpaceUpdateRequestBody } from '../types';

const locationSchema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  iis_main_location: Joi.bool().required(),
  address: Joi.string().required(),
  capacity: Joi.number().integer().min(1).required(),
  image_urls: Joi.array().items(Joi.string()).optional(),
});

const eventspace_update_schema = Joi.object({
  id: Joi.string().uuid(),
  name: Joi.string().required(),
  tagline: Joi.string().default(''),
  social_links: Joi.string().when('format', {
    is: Joi.valid('online'),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  extra_links: Joi.string().default(''),
  event_space_type: Joi.string().valid('tracks', 'schedules').required(),
  status: Joi.string().valid('draft', 'published', 'archived').required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  description: Joi.string().required(),
  format: Joi.string().valid('in-person', 'online').required(),
  event_type: Joi.array().items(Joi.string()).default(['General']),
  experience_level: Joi.array().items(Joi.string()).default(['Beginner']),
  image_url: Joi.string()

});
const eventspace_status_update_schema = Joi.object({
  id: Joi.string().uuid().required(),
  status: Joi.string().valid('draft', 'published', 'archived').required(),
});

const eventspace_create_schema = Joi.object({
  name: Joi.string().required(),
  event_space_type: Joi.string().required(),
});

export const validateEventSpaceUpdate = (body: any): [Joi.ValidationResult<any>, EventSpaceUpdateRequestBody] => {
  const data = { ...body };
  // remove user object added on to the body by session middleware
  delete data.user;
  return [eventspace_update_schema.validate(data), data];
};

export const validateEventSpaceStatusUpdate = (body: any): [Joi.ValidationResult<any>, EventSpaceStatusUpdateRequestBody] => {
  const data = { ...body };
  // remove user object added on to the body by session middleware
  delete data.user;
  return [eventspace_status_update_schema.validate(data), data];
};
export const validateEventSpaceCreate = (body: any): [Joi.ValidationResult<any>, EventSpaceCreateRequestBody] => {
  const data = { ...body };
  // remove user object added on to the body by session middleware
  delete data.user;
  return [eventspace_create_schema.validate(data), data];
};

const uuidv4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
export const validateUUID = (id: any) => {
  let errors = [];
  if (typeof id !== 'string') {
    errors.push('Invalid ID type');
  }
  if (!uuidv4Regex.test(id)) {
    errors.push('Invalid ID format');
  }

  if (id.length > 36) {
    errors.push('Invalid ID length');
  }
  return errors;
};
