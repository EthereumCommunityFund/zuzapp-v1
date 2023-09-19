import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; import { Database } from "@/database.types";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const { user } = req.body;

    const errors = validateUUID(user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Fetch all event spaces for the user
    const eventSpacesResult = await supabase
        .from('eventspace')
        .select('id, event_space_type')
        .eq('creator_id', user.id);

    if (eventSpacesResult.error) {
        logToFile("server error", eventSpacesResult.error.message, eventSpacesResult.error.code, user.email);
        return res.status(500).send("Server error");
    }

    // Check if there's no data
    if (!eventSpacesResult.data || eventSpacesResult.data.length === 0) {
        return res.status(200).json([]);
    }

    const eventSpacesData = await Promise.all(eventSpacesResult.data.map(async (space) => {
        let selectString = `*,
        eventspacelocation: eventspacelocation (*)`;

        // console.log('space', space)
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

    // Filter out any null results due to errors
    const filteredData = eventSpacesData.filter(space => space !== null);

    return res.status(200).json({ data: filteredData });
};



export default withSession(handler);
