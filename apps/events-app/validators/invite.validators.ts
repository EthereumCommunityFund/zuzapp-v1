import { InviteCreateRequestBody, InviteUpdateRequestBody } from '@/types';
import Joi from 'joi';


const invite_create_schema = Joi.object({
    // inviter_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    invitee_email: Joi.string().email().required(),
    event_space_id: Joi.string().guid({ version: 'uuidv4' }).required(),
});

const invite_update_schema = Joi.object({
    invite_id: Joi.string().guid({ version: 'uuidv4' }).required(),
    status: Joi.string().valid('accepted', 'declined').required(),
});


// Usage:

export const validate_invite_create = (body: any): [Joi.ValidationResult<any>, InviteCreateRequestBody] => {
    let data = { ...body };
    if (data.user) {
        delete data.user;
    }
    const result = invite_create_schema.validate(data);
    return [result, data];
};


export const validate_invite_update = (body: any): [Joi.ValidationResult<any>, InviteUpdateRequestBody] => {
    let data = { ...body };
    if (data.user) {
        delete data.user;
    }
    const result = invite_update_schema.validate(data);
    return [result, data];
};
