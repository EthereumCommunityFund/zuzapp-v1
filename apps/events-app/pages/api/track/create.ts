import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import withSession from "../middlewares/withSession";
import { Database } from "@/database.types";
import { logToFile } from "@/utils/logger";
import { validateTrackObject } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const supabase = createPagesServerClient<Database>({ req, res });

    // Validate track data
    const [validation_result, validatedData] = validateTrackObject(req.body);
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email);
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const { name, description, image, event_space_id } = validatedData;

    const result = await supabase
        .from('track').insert({
            name,
            description,
            image,
            event_space_id
        }).select("id").single();

    if (result.error) {
        logToFile("server error", result.error.message, 500, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    return res.status(result.status).json({
        id: result.data.id,
        message: "Track created"
    });
}

export default withSession(handler);
