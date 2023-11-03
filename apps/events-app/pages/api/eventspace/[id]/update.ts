import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceUpdate, validateUUID } from "../../../../validators"
import { formatTimestamp } from "../../../../utils"
import { logToFile } from "../../../../utils/logger"
import { Database } from "@/database.types"
import { QueryWithID } from "@/types"
import withAuthorization from "../../middlewares/withAuthorization"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    // validate request body
    const [validation_result, data] = validateEventSpaceUpdate(req.body)
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

    // Extract the main location data from the validated data
    const { main_location } = data;
    //@ts-ignore
    delete data.main_location; // Remove the location from the main event space data object
    let mainLocationId: string = ""


    if (main_location) {
        const { data: locationData, error: locationInsertError } = await supabase
            .from('eventspacelocation')
            .insert({ ...main_location, event_space_id: id }).select("*")

        if (locationInsertError || !locationData) {
            logToFile("server error", locationInsertError.message, locationInsertError.code, req.body.user.email)
            return res.status(500).send("Internal server error during location insert");
        }

        mainLocationId = locationData[0].id;
    }

    console.log(mainLocationId)



    const updates = {
        ...data,
        start_date: formatTimestamp(data.start_date),
        end_date: formatTimestamp(data.end_date),
    };

    const { data: eventData, error: eventUpdateError } = await supabase
        .from('eventspace')
        .update({ ...updates, main_location_id: mainLocationId })
        .eq('id', id)
        .single();


    console.log(eventData, eventUpdateError)

    if (eventUpdateError) {
        logToFile("server error", eventUpdateError.message, eventUpdateError.code, req.body.user.email)
        return res.status(500).send("Internal server error during event space update");
    }

    // If everything goes well, send back the updated event space data along with the main location id
    return res.status(200).json({
        message: "Event space updated successfully",
        data: eventData,
        mainLocationId
    });
};

export default withSession(withAuthorization(handler));
