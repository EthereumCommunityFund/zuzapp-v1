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

    // Check if the user has already RSVP'ed
    const { data: existingRSVPArray, error: existingRSVPError } = await supabase
        .from('userrsvp')
        .select('*')
        .eq('user_id', req.body.user.id as string)
        .eq('schedule_id', schedule_id as string);

    if (existingRSVPError) {
        logToFile("server error", existingRSVPError.message, existingRSVPError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    if (existingRSVPArray.length > 0) {
        return res.status(200).json({ hasRSVPed: true });
    } else {
        return res.status(200).json({ hasRSVPed: false });
    }
};

export default withSession(handler);
