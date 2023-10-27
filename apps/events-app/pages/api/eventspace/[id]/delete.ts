import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";
import { QueryWithID } from "@/types";
import withAuthorization from "../../middlewares/withAuthorization";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as QueryWithID;



    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Check if the current user is authorized to delete this event space
    const event_space_response = await supabase
        .from('eventspace')
        .select('creator_id')
        .eq('id', id)
        .single();

    if (event_space_response.error || !event_space_response.data) {
        logToFile("server error", event_space_response.error?.message, event_space_response.error?.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }




    const { error, status } = await supabase
        .from('eventspace')
        .delete()
        .eq('id', id);

    if (error) {
        logToFile("server error", error.message, error.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    return res.status(status).send({ message: "Event space deleted" });
};

export default withSession(withAuthorization(handler));
