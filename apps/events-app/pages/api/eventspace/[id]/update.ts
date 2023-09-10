import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceUpdate, validateUUID } from "../../../../validators"
import { formatTimestamp, } from "../../../../utils"
import { logToFile } from "../../../../utils/logger"
import { Database } from "@/database.types"
import { QueryWithID } from "@/types"




const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // validate request body
    const [validation_result, data] = validateEventSpaceUpdate(req.body)
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email)
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }


    const supabase = createPagesServerClient<Database>({ req, res })
    const { id } = req.query as QueryWithID
    console.log(req.query)


    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }


    // Check if the current user is authorized to delete this event space
    const event_space_response = await supabase
        .from('eventspace')
        .select('creator_id')
        .eq('id', id)
        .single();

    if (event_space_response.error || !event_space_response.data) {
        logToFile("server error", event_space_response.error?.message, event_space_response.error?.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    if (event_space_response.data.creator_id !== req.body.user.id) {
        return res.status(403).send("You are not authorized to delete this event space");
    }



    let start_date = formatTimestamp(data.start_date);
    let end_date = formatTimestamp(data.end_date)
    let locations = data?.eventspacelocation
    delete data.eventspacelocation
    console.log(data, "locations")
    if (!start_date || !end_date) return;


    // update event space
    const event_space_update_result = await supabase.from('eventspace').update({
        ...data,
        start_date,
        end_date
    }).eq('id', id)


    if (event_space_update_result.error) {
        logToFile("server error", event_space_update_result.error.message, event_space_update_result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    // update locations
    if (locations && locations?.length > 0) {
        if (locations) {
            for (const location of locations) {
                // If location has an ID, update the record in EventSpaceLocation table
                if (location.id) {
                    const eventSpaceLocationResult = await supabase.from('eventspacelocation').update({
                        event_space_id: id,
                        name: location.name,
                        is_main_location: location.is_main,
                        description: location.description,
                        address: location.address,
                        capacity: location.capacity,
                        image_urls: location.image_urls
                    }).eq('id', location.id);

                    if (eventSpaceLocationResult.error) {
                        logToFile("server error", eventSpaceLocationResult.error.message, eventSpaceLocationResult.error.code, req.body.user.email)
                        return res.status(500).send("Internal server error when updating location");
                    }

                } else {
                    // If location doesn't have an ID, insert a new record in EventSpaceLocation table
                    const eventSpaceLocationInsertResult = await supabase.from('eventspacelocation').insert([{
                        event_space_id: id,
                        name: location.name,
                        is_main_location: location.is_main,
                        description: location.description,
                        address: location.address,
                        capacity: location.capacity,
                        image_urls: location.image_urls
                    }]);

                    if (eventSpaceLocationInsertResult.error) {
                        logToFile("server error", eventSpaceLocationInsertResult.error.message, eventSpaceLocationInsertResult.error.code, req.body.user.email)
                        return res.status(500).send("Internal server error when inserting a new location");
                    }
                }
            }
        }

    }

    return res.status(event_space_update_result.status).end()
}


export default withSession(handler);