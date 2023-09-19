
import Joi, { boolean } from "joi";
import { LocationCreateRequestBody, LocationUpdateRequestBody } from "../types";

const location_create_schema = Joi.object({
    name: Joi.string().required(),
    event_space_id: Joi.string().uuid().required(),
    description: Joi.string().required(),
    is_main_location: Joi.boolean().required().default(false),
    address: Joi.string().required(),
    capacity: Joi.number().min(1).required(),
    image_urls: Joi.array().items(Joi.string().uri()).required(),
});


export const location_update_schema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    is_main_location: Joi.boolean(),
    address: Joi.string().required(),
    capacity: Joi.number().min(1).required(),
    image_urls: Joi.array().items(Joi.string().uri()).required(),
    event_space_id: Joi.string().uuid().required(),
});


export const validateLocationCreation = (body: any): [Joi.ValidationResult<any>, LocationCreateRequestBody] => {
    let data = { ...body }
    delete data.user
    const result = location_create_schema.validate(data);
    return [result, result.value];
};

export const validateLocationUpdate = (body: any): [Joi.ValidationResult<any>, LocationUpdateRequestBody] => {
    let data = { ...body }
    delete data.user
    const result = location_update_schema.validate(data);
    return [result, result.value];
};