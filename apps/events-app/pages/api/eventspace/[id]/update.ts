import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceUpdate, validateUUID } from "../../../../validators"
import { formatTimestamp, } from "../../../../utils"
import { logToFile } from "../../../../utils/logger"
import { Database, EventSpaceLocationInsert, EventSpaceLocationUpdate } from "@/database.types"
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


    // Check if the current user is authorized to update this event space
    const event_space_response = await supabase
        .from('eventspace')
        .select('creator_id')
        .eq('id', id)
        .single();

    console.log(event_space_response)
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
        // Separate locations into updates and inserts
        const locationsToUpdate = locations.filter(loc => loc.id);
        const locationsToInsert = locations.filter(loc => !loc.id);

        // Prepare promises for the locations to update
        const updatePromises = locationsToUpdate.map((location: EventSpaceLocationUpdate) => {
            if (location.id) {
                return supabase.from('eventspacelocation').update({
                    event_space_id: id,
                    name: location.name,
                    is_main_location: location.is_main_location,
                    description: location.description,
                    address: location.address,
                    capacity: location.capacity,
                    image_urls: location.image_urls
                } as EventSpaceLocationUpdate).eq('id', location.id);
            }

        });

        // Prepare promises for the locations to insert
        const insertPromises = locationsToInsert.map(location => {
            return supabase.from('eventspacelocation').insert({
                event_space_id: id,
                name: location.name,
                is_main_location: location.is_main,
                description: location.description,
                address: location.address,
                capacity: location.capacity,
                image_urls: location.image_urls
            } as EventSpaceLocationInsert);
        });

        try {
            // Execute all promises concurrently
            const results: any = await Promise.all([...updatePromises, ...insertPromises]);

            console.log('result', results)

            // Error handling
            for (const result of results) {
                if (result.error) {
                    logToFile("server error", result.error.message, result.error.code, req.body.user.email);
                    return res.status(500).send("Internal server error when processing locations");
                }
            }

        } catch (error: any) {
            logToFile("server error", error.message, 500, req.body.user.email);
            return res.status(500).send("Internal server error");
        }
    }
    return res.status(event_space_update_result.status).end()

}


export default withSession(handler);