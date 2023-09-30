// /api/update-invite.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { validate_invite_update } from "@/validators/invite.validators"; // make sure to create this validator
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query;
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    let { data, error } = await supabase.from('eventspaceinvites').select('*').eq('id', id as string).single();

    if (error) {
        logToFile("server error", error.message, error.code, req.body.user.email);
        return res.status(404).send("Invite not found");
    }
    if (!data) {
        return res.status(404).send("Invite not found");
    }

    return res.status(200).json({ data })



};

export default withSession(handler);
