//@ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";
import { Database } from "@/database.types";
import { QueryWithUserID } from "@/types"; // Update types to get user ID from query
import { timeToMinutes } from "@/utils";

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
            track: track!id (*),
            scheduletags: scheduletags!id (tags: tags!id (*)),
            schedulespeakerrole: schedulespeakerrole!id (role, speaker: speaker!id (name))
        `)
        .in("id", scheduleIds)
        .order('start_period', { ascending: true });

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Schedules not found");
    }

    // Sort the data based on date and just the time portion of start_time
    // Sort the data based on date and just the time portion of start_time
    // data.sort((a: any, b: any) => {
    //     if (a.start_date < b.start_date) return -1;
    //     if (a.start_date > b.start_date) return 1;
    //     const timeA = timeToMinutes(a.start_time);
    //     const timeB = timeToMinutes(b.start_time);
    //     return timeA - timeB;
    // });

    let response: any = [];

    data.map(item => {
        let result = {
            ...item,
            tags: item.scheduletags.map((tagObj: any) => tagObj.tags.name),
            organizers: item.schedulespeakerrole.map((speakerObj: any) => ({
                name: speakerObj.speaker.name,
                role: speakerObj.role,
            })),
            trackName: item.track?.name,
        };

        //@ts-ignore
        delete result?.scheduletags; // cleaning up the extra data
        //@ts-ignore
        delete result?.schedulespeakerrole; // cleaning up the extra data
        response.push(result);
    });

    return res.status(200).json({ data: response });
};


export default withSession(handler);
