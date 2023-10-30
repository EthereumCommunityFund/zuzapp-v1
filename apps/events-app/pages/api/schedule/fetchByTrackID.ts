import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";
import { Database } from "@/database.types";
import { QueryWithID } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { track_id: id } = req.query as QueryWithID;

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Fetch the data
    const { data, error } = await supabase
        .from("schedule")
        .select(`
            *,
            scheduletags: scheduletags!id (tags: tags!id (*)),
            schedulespeakerrole: schedulespeakerrole!id (role, speaker: speaker!id (name)),
            editlogs: editlogs!schedule_id (*, user: profile!uuid (username))
        `)
        .eq("track_id", id)
        .order('start_date', { ascending: true });

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Schedule not found");
    }

    if (!data) {
        return res.status(404).send("Schedule not found");
    }

    // Sort the data based on date and just the time portion of start_time
    data.sort((a, b) => {
        if (a.start_date < b.start_date) return -1;
        if (a.start_date > b.start_date) return 1;

        const timeA = new Date(a.start_time).getUTCHours() * 60 + new Date(a.start_time).getUTCMinutes();
        const timeB = new Date(b.start_time).getUTCHours() * 60 + new Date(b.start_time).getUTCMinutes();
        return timeA - timeB;
    });

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
        delete result?.scheduletags; // cleaning up the extra data
        //@ts-ignore
        delete result?.schedulespeakerrole; // cleaning up the extra data
        response.push(result);
    });

    return res.status(200).json({ data: response });
};

export default handler;



