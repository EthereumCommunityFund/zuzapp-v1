//@ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";
import { Database } from "@/database.types";
import { QueryWithUserID } from "@/types"; // Update types to get user ID from query

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    // Assuming you're receiving user ID in request body
    const userID = req.body.user.id;

    // Fetch all schedule_ids where the user has RSVP'd
    const rsvpResponse = await supabase
        .from('userrsvp')
        .select('schedule_id')
        .eq('user_id', userID);

    if (rsvpResponse.error) {
        logToFile("server error", rsvpResponse.error.message, rsvpResponse.error.code, "Unknown user");
        return res.status(500).send("Error fetching RSVP data");
    }

    const scheduleIds = rsvpResponse.data.map(rsvp => rsvp.schedule_id);

    if (!scheduleIds.length) {
        return res.status(200).send({ data: [] }); // If no RSVPs, return empty array
    }

    // Fetch schedules using the above obtained IDs
    const { data, error } = await supabase
        .from("schedule")
        .select(`
            *,
            scheduletags: scheduletags!id (tags: tags!id (*)),
            schedulespeakerrole: schedulespeakerrole!id (role, speaker: speaker!id (name))
        `)
        .in("id", scheduleIds)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Schedules not found");
    }

    let response: any = [];

    data.map(item => {
        let result = {
            ...item,
            tags: item.scheduletags.map((tagObj: any) => tagObj.tags.name),
            organizers: item.schedulespeakerrole.map((speakerObj: any) => ({
                name: speakerObj.speaker.name,
                role: speakerObj.role,
            })),
        };

        //@ts-ignore
        delete result?.scheduletags;
        //@ts-ignore
        delete result?.schedulespeakerrole;
        response.push(result);
    });

    return res.status(200).json({ data: response });
};

export default withSession(handler);