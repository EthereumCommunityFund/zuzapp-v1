import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const { id: schedule_id } = req.query;
    const errors = validateUUID(schedule_id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }


    // Check if the schedule exists
    const { data: existingScheduleArray, error: existingScheduleError } = await supabase
        .from('schedule')
        .select('current_rsvp_no, limit_rsvp, rsvp_amount')
        .eq('id', schedule_id as string);

    if (existingScheduleError) {
        logToFile("server error", existingScheduleError.message, existingScheduleError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    if (existingScheduleArray.length === 0) {
        return res.status(404).json({ message: "Schedule does not exist" });
    }




    let existingSchedule = existingScheduleArray[0];
    if (existingSchedule.limit_rsvp && existingSchedule.current_rsvp_no >= existingSchedule.rsvp_amount) {
        return res.status(400).json({ message: "RSVP limit has been reached for this schedule" });
    }

    // Increment the RSVP number for the schedule
    const { error: rsvpError } = await supabase
        .from('schedule')
        .update({ current_rsvp_no: existingSchedule.current_rsvp_no + 1 })
        .eq('id', schedule_id as string);

    if (rsvpError) {
        logToFile("server error", rsvpError.message, rsvpError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    return res.status(200).json({ message: "RSVP successful" });

}


export default withSession(handler);
