import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });


    const { user } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;


    const errors = validateUUID(user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    const { count, error } = await supabase
        .from('eventspace')
        .select('id', { count: 'exact' })
        .eq('creator_id', user.id);

    // Check if there's an error with the count query
    if (typeof count !== 'number') {
        logToFile("server error", "server error: Unable to fetch count", 500, user.email);
        return res.status(500).send("Server error");
    }

    const eventSpacesResult = await supabase
        .from('eventspace')
        .select('id, event_space_type')
        .eq('creator_id', user.id)
        .limit(limit)
        .range(offset, offset + limit - 1);

    if (eventSpacesResult.error) {
        logToFile("server error", eventSpacesResult.error.message, eventSpacesResult.error.code, user.email);
        return res.status(500).send("Server error");
    }

    if (!eventSpacesResult.data || eventSpacesResult.data.length === 0) {
        return res.status(200).json({ data: [], currentPage: page, limit: limit, totalCount: 0 });
    }

    const eventSpacesData = await Promise.all(eventSpacesResult.data.map(async (space) => {
        let selectString = `*,
        eventspacelocation: eventspacelocation (*)`;

        if (space.event_space_type === 'schedules') {
            selectString += `, schedules: schedule (*)`;
        } else if (space.event_space_type === 'tracks') {
            selectString += `, tracks: track (*),  schedules: schedule (*)`;
        }

        const { data, error } = await supabase
            .from('eventspace')
            .select(selectString)
            .eq('id', space.id)
            .single();

        if (error) {
            logToFile("server error", error.message, error.code, user.email);
            return null;
        }

        return data;
    }));

    const filteredData = eventSpacesData.filter(space => space !== null);

    return res.status(200).json({ data: filteredData, currentPage: page, limit: limit, totalCount: count });
};

export default withSession(handler);
