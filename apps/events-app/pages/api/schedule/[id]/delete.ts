import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { validateTrackUpdate, validateUUID } from "../../../../validators";
import { logToFile } from "../../../../utils/logger";
import { Database } from "@/database.types";
import { QueryWithID } from "@/types";

const deleteScheduleHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as QueryWithID;


    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // // Check if the current user is authorized to delete this schedule
    // const schedule_response = await supabase
    //     .from('schedule')
    //     .select('creator_id')
    //     .eq('id', id)
    //     .single();

    // if (schedule_response.error || !schedule_response.data) {
    //     logToFile("server error", schedule_response.error?.message, schedule_response.error?.code, req.body?.user?.email || "Unknown user");
    //     return res.status(500).send("Internal server error");
    // }

    // if (schedule_response.data.creator_id !== req.body.user.id) {
    //     return res.status(403).send("You are not authorized to delete this schedule");
    // }

    const { error, status } = await supabase
        .from('schedule')
        .delete()
        .eq('id', id);

    if (error) {
        logToFile("server error", error.message, error.code, req.body?.user?.email || "Unknown user");
        return res.status(500).send("Internal server error");
    }

    return res.status(status).send("Schedule deleted");
};

export default withSession(deleteScheduleHandler);
