import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceUpdate, validateUUID } from "../../../../validators"
import { formatTimestamp, } from "../../../../utils"
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
    // console.log(req.query)


    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }





    let start_date = formatTimestamp(data.start_date);
    let end_date = formatTimestamp(data.end_date)
    delete data.eventspacelocation
    console.log(data, "locations")
    if (!start_date || !end_date) return;




    // update event space
    const event_space_update_result = await supabase.from('eventspace').update({
        ...data,
        start_date,
        end_date
    }).eq('id', id).select("*").single();


    if (event_space_update_result.error) {
        logToFile("server error", event_space_update_result.error.message, event_space_update_result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }


    return res.status(event_space_update_result.status).json({
        message: "Event space updated",
        data: event_space_update_result.data
    })

}




export default withSession(withAuthorization(handler));