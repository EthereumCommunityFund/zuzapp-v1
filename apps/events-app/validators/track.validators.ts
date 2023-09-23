import { TrackCreateRequestBody, TrackUpdateRequestBody } from '@/types';

import Joi from 'joi';

const track_create_schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    event_space_id: Joi.string().uuid().required(),
});

const track_update_schema = Joi.object({
    id: Joi.string().uuid(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    event_space_id: Joi.string().uuid().required(),
});



export const validateTrackCreation = (body: any): [Joi.ValidationResult<any>, TrackCreateRequestBody] => {
    let data = { ...body }
    if (data.user) {
        delete data.user
    }
    const result = track_create_schema.validate(data);
    return [result, data];
};
export const validateTrackUpdate = (body: any): [Joi.ValidationResult<any>, TrackUpdateRequestBody] => {
    let data = { ...body }
    if (data.user) {
        delete data.user
    }
    const result = track_update_schema.validate(data);
    return [result, data];
};
