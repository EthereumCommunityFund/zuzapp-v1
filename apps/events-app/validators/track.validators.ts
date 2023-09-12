import Joi from 'joi';

const track_schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().required(),
    event_space_id: Joi.string().uuid().required(),
});

export const validateTrackObject = (data: any) => {
    const result = track_schema.validate(data);
    return [result, result.value];
};
