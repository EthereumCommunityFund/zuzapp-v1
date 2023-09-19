import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import withSession from "../middlewares/withSession";
import { Database } from "@/database.types";
import { EventSpaceCreateRequestBody } from "@/types";
import { validateEventSpaceCreate } from "@/validators";
import { logToFile } from "@/utils/logger";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const supabase = createPagesServerClient<Database>({ req, res });


    const [validation_result, data] = validateEventSpaceCreate(req.body)
    // validate request body
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email)
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const { name, event_space_type } = data



    const result = await supabase
        .from('eventspace')
        .insert(
            {
                name,
                event_space_type,
                creator_id: req.body.user.id
            });



    console.log(result)
    if (result.error) {
        return res.status(500).send("Internal server error");
    }

    return res.status(result.status).json({
        message: "Event space created",
        data: result.data
    })
}

export default withSession(handler)