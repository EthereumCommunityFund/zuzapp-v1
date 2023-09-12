import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import withSession from "../middlewares/withSession";
import { Database } from "@/database.types";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const supabase = createPagesServerClient<Database>({ req, res });


    // add joi verification
    const { name, event_space_type, user } = req.body



    const result = await supabase
        .from('eventspace')
        .insert(
            {
                name,
                event_space_type,
                creator_id: user.id
            });



    console.log(result)
    if (result.error) {
        return res.status(500).send("Internal server error");
    }

    return res.status(result.status).json({
        message: "Event space created",
        id: result.data
    })
}

export default withSession(handler)