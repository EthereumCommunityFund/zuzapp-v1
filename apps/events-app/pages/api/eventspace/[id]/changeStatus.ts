import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceStatusUpdate, validateUUID } from "../../../../validators"
import { logToFile } from "../../../../utils/logger"
import { Database } from "@/database.types"
import { QueryWithID } from "@/types"





const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // validate request body
    const [validation_result, data] = validateEventSpaceStatusUpdate(req.body)
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


    // Check if the current user is authorized to update this event space status
    const event_space_response = await supabase
        .from('eventspace')
        .select('creator_id')
        .eq('id', id)
        .single();

    // console.log(event_space_response)
    if (event_space_response.error || !event_space_response.data) {
        logToFile("server error", event_space_response.error?.message, event_space_response.error?.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    if (event_space_response.data.creator_id !== req.body.user.id) {
        return res.status(403).send("You are not authorized to edit this event space");
    }






    // update event space
    const event_space_update_result = await supabase.from('eventspace').update({
        status: data.status
    }).eq('id', id).select("*").single();


    if (event_space_update_result.error) {
        logToFile("server error", event_space_update_result.error.message, event_space_update_result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }


    return res.status(event_space_update_result.status).json({
        message: `Event space ${data.status}`,
        data: event_space_update_result.data
    })

}


export default withSession(handler);