import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { validateTrackUpdate, validateUUID } from "../../../../validators";
import { logToFile } from "../../../../utils/logger";
import { Database } from "@/database.types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const [validation_result, data] = validateTrackUpdate(req.body);
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email);
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as { id: string };

    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }


    // Check if the current user is authorized to update this event space
    const event_space_response = await supabase
    //     .from('eventspace')
    //     .select('creator_id')
    //     .eq('id', id)
    //     .single();

    // console.log(event_space_response)
    // if (event_space_response.error || !event_space_response.data) {
    //     console.log('error here ');
    //     logToFile("server error", event_space_response.error?.message, event_space_response.error?.code, req.body?.user?.email || "Unknown user");
    //     return res.status(500).send("Internal server error");
    // }



    const track_update_result = await supabase.from('track').update({
        description: data.description,
        name: data.name,
        image: data.image

    }).eq('id', id).select("*");

    if (track_update_result.error) {
        logToFile("server error", track_update_result.error.message, track_update_result.error.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    return res.status(track_update_result.status).json(track_update_result.data)
}

export default withSession(handler);
