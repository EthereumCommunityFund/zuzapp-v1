import Joi from 'joi';

const schedule_schema = Joi.object({
    name: Joi.string().required(),
    format: Joi.string().valid('in-person', 'online', 'hybrid').required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    start_time: Joi.date().required(),
    end_time: Joi.date().required(),
    all_day: Joi.boolean().required(),
    schedule_frequency: Joi.string().valid('once', 'everyday', 'weekly').required(),
    images: Joi.array().items(Joi.string().uri()).default([]),
    video_call_link: Joi.string().uri().optional(),
    live_stream_url: Joi.string().uri().optional(),
    location_id: Joi.string().uuid().required(),
    event_type: Joi.array().items(Joi.string()).default(['General']).required(),
    experience_level: Joi.array().items(Joi.string()).default(['beginner']).required(),
    rsvp_amount: Joi.number().integer().required(),
    event_space_id: Joi.string().uuid().required(),
    track_id: Joi.string().uuid().optional()
});


export const validateScheduleObject = (data: any) => {
    const result = schedule_schema.validate(data);
    return [result, result.value];
};