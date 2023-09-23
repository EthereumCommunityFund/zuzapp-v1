import { ScheduleCreateRequestBody, ScheduleUpdateRequestBody } from "@/types";
import Joi from "joi";

const speakerSchema = Joi.object({
    speaker_name: Joi.string().required(),
    role: Joi.string().required()
});

const schedule_create_schema = Joi.object({
    name: Joi.string().required(),
    format: Joi.string().valid('in-person', 'online', 'hybrid').required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    all_day: Joi.boolean().default(false),
    schedule_frequency: Joi.string().valid('once', 'everyday', 'weekly').required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    video_call_link: Joi.string().uri().optional(),
    live_stream_url: Joi.string().uri().optional(),
    location_id: Joi.string().uuid().required(),
    event_type: Joi.array().items(Joi.string()),
    experience_level: Joi.array().items(Joi.string()),
    rsvp_amount: Joi.number().integer().default(0),
    event_space_id: Joi.string().uuid().required(),
    track_id: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string()).default([]),
    speakers: Joi.array().items(speakerSchema).default([])
});


const schedule_update_schema = Joi.object({
    name: Joi.string().required(),
    format: Joi.string().valid('in-person', 'online', 'hybrid').required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    start_time: Joi.date().when('all_day', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional().default(Date.now()),
    }),
    end_time: Joi.date().when('all_day', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.optional().default(Date.now()),
    }),
    all_day: Joi.boolean().default(false),
    schedule_frequency: Joi.string().valid('once', 'everyday', 'weekly').required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    video_call_link: Joi.string().uri().optional(),
    live_stream_url: Joi.string().uri().optional(),
    location_id: Joi.string().uuid().required(),
    event_type: Joi.string(),
    experience_level: Joi.string(),
    rsvp_amount: Joi.number().integer().default(50),
    event_space_id: Joi.string().uuid().required(),
    track_id: Joi.string().uuid().optional(),
    tags: Joi.array().items(Joi.string()).default([]),
    speakers: Joi.array().items(speakerSchema).default([])
});




export const validateScheduleCreation = (body: any): [Joi.ValidationResult<any>, ScheduleCreateRequestBody] => {
    let data = { ...body }
    delete data.user
    const result = schedule_create_schema.validate(data);
    return [result, result.value];
};

export const validateScheduleUpdate = (body: any): [Joi.ValidationResult<any>, ScheduleUpdateRequestBody] => {
    let data = { ...body }
    delete data.user
    const result = schedule_update_schema.validate(data);
    return [result, result.value];
};