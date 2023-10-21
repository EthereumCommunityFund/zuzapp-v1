import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../middlewares/withSession";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const errors = validateUUID(req.body.user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: "Username is missing from the request body" });
    }

    // Check if username already exists
    const { data: existingUser } = await supabase
        .from('profile')
        .select('username')
        .eq('username', username)
        .single();

    if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Continue with updating the username
    const { error } = await supabase
        .from('profile')
        .update({ username })
        .eq('uuid', req.body.user.id);

    if (error) {
        logToFile("server error", error.message, error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    return res.status(200).json({ message: "Username updated successfully", data: username });
};

export default withSession(handler);
