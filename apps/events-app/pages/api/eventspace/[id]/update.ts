import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceUpdate, validateUUID } from "../../../../validators"
import { formatTimestamp, } from "../../../../utils"
import { logToFile } from "../../../../utils/logger"
import { Database } from "@/database.types"
import { QueryWithID } from "@/types"




const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const [validation_result, data] = validateEventSpaceUpdate(req.body)


    console.log(validation_result.error, "result")
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email)
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }


    const supabase = createPagesServerClient<Database>({ req, res })
    const { id } = req.query as QueryWithID

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }



    let start_date = formatTimestamp(data.start_date);
    let end_date = formatTimestamp(data.end_date)
    let locations = data?.locations

    delete data.locations;

    const event_space_update_result = await supabase.from('eventspace').update({
        ...data,
        start_date,
        end_date
    }).eq('id', id)


    if (event_space_update_result.error) {
        logToFile("server error", event_space_update_result.error.message, event_space_update_result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    if (locations) {
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
                    }).eq('id', location.id);  // Match by location's ID for update

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