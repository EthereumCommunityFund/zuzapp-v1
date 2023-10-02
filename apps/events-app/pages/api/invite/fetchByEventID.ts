// /api/fetch-invites.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../middlewares/withSession";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { event_space_id } = req.query;

    // Validate the UUID for event_space_id
    const errors = validateUUID(event_space_id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Query to fetch invites by event_space_id
    let { data, error } = await supabase
        .from('eventspaceinvites')
        .select('*')
        .eq('event_space_id', event_space_id as number).in('status', ['pending', 'accepted', 'declined'])

    if (error) {
        logToFile("server error", error.message, error.code, req.body.user.email);
        return res.status(404).send("No invites found");
    }

    if (!data || data.length === 0) {
        return res.status(404).send("No invites found");
    }

    return res.status(200).json({ data });
};

export default withSession(handler);
