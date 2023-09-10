import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; import { Database } from "@/database.types";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";
import withSession from "../../middlewares/withSession";
import { QueryWithID } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as QueryWithID;

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { error, status } = await supabase
        .from('eventspacelocation')
        .delete()
        .eq('id', id);

    if (error) {
        logToFile("server error", error.message, error.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    return res.status(status).send("Event space location deleted");
};

export default withSession(handler);
