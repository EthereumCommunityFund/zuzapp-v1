import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const { id: schedule_id } = req.query;


    const scheduleIdErrors = validateUUID(schedule_id);

    if (scheduleIdErrors.length > 0) {
        return res.status(400).json({ errors: [...scheduleIdErrors] });
    }

    // Check if the user has previously RSVP'ed
    const { data: existingRSVPArray, error: existingRSVPError } = await supabase
        .from('userrsvp')
        .select('*')
        .eq('user_id', req.body.user.id as string)
        .eq('schedule_id', schedule_id as string);

    if (existingRSVPError) {
        logToFile("server error", existingRSVPError.message, existingRSVPError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    if (existingRSVPArray.length === 0) {
        return res.status(400).json({ message: "You haven't RSVP'ed to this schedule." });
    }

    // Remove the RSVP from the UserRSVP table
    const { error: deleteRSVPError } = await supabase
        .from('userrsvp')
        .delete()
        .eq('user_id', req.body.user.id as string)
        .eq('schedule_id', schedule_id as string);

    if (deleteRSVPError) {
        logToFile("server error", deleteRSVPError.message, deleteRSVPError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    // Get the current RSVP count for the schedule
    const { data: scheduleData, error: scheduleError } = await supabase
        .from('schedule')
        .select('current_rsvp_no')
        .eq('id', schedule_id as string);

    if (scheduleError) {
        logToFile("server error", scheduleError.message, scheduleError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    if (scheduleData && scheduleData.length > 0) {
        const currentRSVP = scheduleData[0].current_rsvp_no || 0;

        // Decrement the RSVP count
        const { error: decrementRSVPError } = await supabase
            .from('schedule')
            .update({ current_rsvp_no: currentRSVP - 1 })
            .eq('id', schedule_id as string);

        if (decrementRSVPError) {
            logToFile("server error", decrementRSVPError.message, decrementRSVPError.code, req.body.user.email);
            return res.status(500).send("Internal server error");
        }
    } else {
        return res.status(404).json({ message: "Schedule not found." });
    }

    return res.status(200).json({ message: "RSVP canceled successfully." });
};

export default withSession(handler);
