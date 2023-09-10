import Joi, { boolean } from "joi";
import { EventSpaceUpdateData } from "../types";

const locationSchema = Joi.object({
    id: Joi.string(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    is_main: Joi.bool().required(),
    address: Joi.string().required(),
    capacity: Joi.number().integer().min(1).required(),
    image_urls: Joi.array().items(Joi.string()).optional()
});

const eventspace_update_schema = Joi.object({
    name: Joi.string().required(),
    event_space_type: Joi.string().valid('tracks', 'schedules').required(),
    status: Joi.string().valid('draft', 'published', 'archived').required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    description: Joi.string().required(),
    format: Joi.string().valid('in-person', 'online', 'hybrid').required(),
    event_type: Joi.array().items(Joi.string()).default(['General']).required(),
    experience_level: Joi.array().items(Joi.string()).default(['beginner']).required(),
    locations: Joi.array().items(locationSchema).min(1).required()
});

export const validateEventSpaceUpdate = (body: any): [Joi.ValidationResult<any>, EventSpaceUpdateData] => {
    const data = { ...body }
    // remove user object added on to the body by session middleware 
    delete data.user;
    return [eventspace_update_schema.validate(data), data];
}




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