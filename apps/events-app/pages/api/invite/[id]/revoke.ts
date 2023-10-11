// /api/revoke-invite.ts

import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";
import withAuthorization from "../../middlewares/withAuthorization";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query;

    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { data, error } = await supabase
        .from('eventspaceinvites')
        .update({ status: 'revoked' })
        .eq('id', id as string);

    if (error) {
        logToFile("server error", error.message, error.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    console.log(data)
    return res.status(200).json({ message: "Invite revoked successfully" });
};

export default withSession(withAuthorization(handler));
