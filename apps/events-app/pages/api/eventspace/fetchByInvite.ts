import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";

const fetchInvitedEventSpaces = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const { user } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const errors = validateUUID(user.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Get the total count of accepted invites
    const { count } = await supabase
        .from('eventspaceinvites')
        .select('event_space_id', { count: 'exact' })
        .eq('invitee_id', user.id)
        .eq('status', 'accepted');

    // Fetch accepted invites for the user
    const invitedSpacesResult = await supabase
        .from('eventspaceinvites')
        .select('event_space_id')
        .eq('invitee_id', user.id)
        .eq('status', 'accepted')
        .limit(limit)
        .range(offset, offset + limit - 1);

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

    const filteredData = eventSpacesData.filter(space => space !== null);

    return res.status(200).json({ data: filteredData, currentPage: page, limit: limit, totalCount: count });
};

export default withSession(fetchInvitedEventSpaces);
