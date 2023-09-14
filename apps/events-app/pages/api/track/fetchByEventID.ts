

import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";
import { Database } from "@/database.types";
import { QueryWithID } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    // Assuming the ID is passed as a query parameter
    const { event_space_id } = req.query;

    // Validate UUID
    const errors = validateUUID(event_space_id as string);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Fetch Tracks by Event Space ID
    const { data: tracks, error: trackError } = await supabase
        .from('track')
        .select('*')
        .eq('event_space_id', event_space_id as string);

    if (trackError) {
        logToFile("server error", trackError.message, trackError.code, "Unknown user");
        return res.status(500).send("Error fetching tracks");
    }

    if (!tracks || tracks.length === 0) {
        return res.status(404).send("No tracks found for the given event space ID");
    }

    const trackIds = tracks.map(track => track.id);

    const { data: schedules, error: scheduleError } = await supabase
        .from('schedule')
        .select('*')
        .in('track_id', trackIds);

    if (scheduleError) {
        logToFile("server error", scheduleError.message, scheduleError.code, "Unknown user");
        return res.status(500).send("Error fetching schedules");
    }

    const tracksWithSchedules = tracks.map(track => ({
        ...track,
        schedules: schedules.filter(schedule => schedule.track_id === track.id)
    }));

    return res.status(200).json(tracksWithSchedules);
};

export default handler;

