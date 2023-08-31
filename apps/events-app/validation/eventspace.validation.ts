import Joi from "joi";

interface EventSpaceUpdateData {
    name: string;
    event_space_type: "tracks" | "schedules",
    start_date: number;
    end_date: number;
    description: string;
    format: "in-person" | "online" | "hybrid";
    event_type: string[];
    experience_level: string[];
    status: "draft" | "published" | "archived"
}


const eventspace_update_schema = Joi.object({
    name: Joi.string().required(),
    event_space_type: Joi.string().valid('tracks', 'schedules').required(),
    status: Joi.string().valid('draft', 'published', 'archived').required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    description: Joi.string().required(),
    format: Joi.string().valid('in-person', 'online', 'hybrid').default('online'),
    event_type: Joi.array().items(Joi.string()).default(['General']).required(),
    experience_level: Joi.array().items(Joi.string()).default(['beginner']).required(),
});

export const validateEventSpaceUpdate = (body: any): [Joi.ValidationResult<any>, EventSpaceUpdateData] => {
    const data = { ...body }
    // remove user object added on to the body by session middleware 
    delete data.user;


    return [eventspace_update_schema.validate(data), data];
}
