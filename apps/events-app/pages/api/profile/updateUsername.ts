import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../middlewares/withSession";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    // Validate the UUID from req.user.body.id
    const errors = validateUUID(req.body.user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }



    // Extract the new username from req.body
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is missing from the request body" });
    }

    // Update the username table where the uuid column matches req.user.body.id
    const { error } = await supabase
        .from('profile')
        .update({ username })
        .eq('uuid', req.body.user.id);

    if (error) {
        logToFile("server error", error.message, error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    return res.status(200).json({ message: "Username updated successfully" });
};

export default withSession(handler);
