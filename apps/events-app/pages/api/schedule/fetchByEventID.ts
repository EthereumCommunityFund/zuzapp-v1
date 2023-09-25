//@ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";
import { Database } from "@/database.types";
import { QueryWithID } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { event_space_id: id } = req.query as QueryWithID;


    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Use a join to fetch the schedule, its tags, and speakers in one query
    const { data, error } = await supabase
        .from("schedule")
        .select(`
        *,
        scheduletags: scheduletags!id (tags: tags!id (*)),
        schedulespeakerrole: schedulespeakerrole!id (speaker: speaker!id (*))
    `).eq("event_space_id", id);

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Schedule not found");
    }

    if (!data) {
        return res.status(404).send("Schedule not found");
    }


    let response: any = []

    data.map(item => {
        let result = {
            ...item,
            tags: item.scheduletags.map((tagObj: any) => tagObj.tags.name),
            speakers: item.schedulespeakerrole.map((speakerObj: any) => ({
                name: speakerObj.speaker.name,
                role: speakerObj.role,
            })),
        }

        //@ts-ignore
        delete result?.scheduletags; // cleaning up the extra data
        //@ts-ignore
        delete result?.schedulespeakerrole; // cleaning up the extra data
        response.push(result)
    })




    return res.status(200).json({ data: response });
};

export default handler;
