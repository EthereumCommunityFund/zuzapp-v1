import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";
import withSession from "../../middlewares/withSession";
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



    // Use a join to get the creator_id of the related eventspace
    const response: any = await supabase
        .from('eventspacelocation')
        .select('eventspace: event_space_id (creator_id)')
        .eq('id', id)
        .single();


    if (response.error || !response.data) {
        logToFile("server error", response.error?.message, response.error?.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    // console.log(response.data.eventspace, 'event space');




    const { error, status } = await supabase
        .from('eventspacelocation')
        .delete()
        .eq('id', id);

    if (error) {
        logToFile("server error", error.message, error.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    return res.status(status).send({ message: "Event space location deleted" });
};


export default withSession(withAuthorization(handler));
