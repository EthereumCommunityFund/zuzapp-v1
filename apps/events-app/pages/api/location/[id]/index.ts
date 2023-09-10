import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";
import { QueryWithID } from "@/types";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as QueryWithID;

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { data, error } = await supabase
        .from('eventspacelocation')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(500).send("Server error");
    }

    return res.status(200).json(data);
};

export default handler;
