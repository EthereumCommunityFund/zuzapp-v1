import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";
import { Database, TrackResponseType } from "@/database.types";
import { QueryWithID } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as QueryWithID;

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Fetch Track by its ID
    const { data, error } = await supabase
        .from('track')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Track not found");
    }

    if (!data) {
        return res.status(404).send("Track not found");
    }

    return res.status(200).json(data);
};

export default handler;
