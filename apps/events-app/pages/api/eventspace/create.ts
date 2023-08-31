import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import withSession from "../middlewares/withSession";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const supabase = createPagesServerClient({ req, res });

    const { name, event_space_type, user } = req.body


    const result = await supabase
        .from('eventspace')
        .insert(
            {
                name,
                event_space_type,
                creator_id: user.id
            },
        )



    if (result.error) {
        return res.status(500).send("Internal server error");
    }

    return res.status(result.status).send("Event space created")
}

export default withSession(handler)