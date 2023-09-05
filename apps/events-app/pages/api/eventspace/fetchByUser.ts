import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient({ req, res });

    const { user } = req.body;


    const errors = validateUUID(user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }


    const { data, error } = await supabase
        .from('eventspace')
        .select('*')
        .eq('creator_id', user.id);


    if (error) {
        logToFile("server error", error.message, error.code, user.email);
        return res.status(500).send("Server error");
    }

    // Send back the event spaces
    return res.status(200).json(data);
};

// If you're using the withSession middleware, make sure to include it in the export
export default withSession(handler);
