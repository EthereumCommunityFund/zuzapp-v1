import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";

const fetchInvitedEventSpaces = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const { user } = req.body;

    const errors = validateUUID(user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Fetch accepted invites for the user
    const invitedSpacesResult = await supabase
        .from('eventspaceinvites')
        .select('event_space_id')
        .eq('invitee_id', user.id)
        .eq('status', 'accepted');

    if (invitedSpacesResult.error) {
        logToFile("server error", invitedSpacesResult.error.message, invitedSpacesResult.error.code, user.email);
        return res.status(500).send("Server error");
    }

    // Fetch event spaces data for the accepted invites
    const invitedEventSpacesResult = await supabase
        .from('eventspace')
        .select('id, event_space_type')
        .in('id', invitedSpacesResult.data.map(invite => invite.event_space_id));

    if (invitedEventSpacesResult.error) {
        logToFile("server error", invitedEventSpacesResult.error.message, invitedEventSpacesResult.error.code, user.email);
        return res.status(500).send("Server error");
    }

    const eventSpacesData = await Promise.all(invitedEventSpacesResult.data.map(async (space) => {
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

    // Filter out any null results due to errors
    const filteredData = eventSpacesData.filter(space => space !== null);

    return res.status(200).json({ data: filteredData });
};

export default withSession(fetchInvitedEventSpaces);
