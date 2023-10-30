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

    // Fetch the data
    const { data, error } = await supabase
        .from("schedule")
        .select(`
            *,
            scheduletags: scheduletags!id (tags: tags!id (*)),
            schedulespeakerrole: schedulespeakerrole!id (role, speaker: speaker!id (name))
            editlogs: editlogs!schedule_id (*, user: profile!uuid (username))
        `)
        .eq("event_space_id", id)
        .order('start_date', { ascending: true });



    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Schedule not found");
    }

    if (!data || data.length === 0) {
        return res.status(200).send({ data: [] });
    }

    console.log(data, "data")

    // data.sort((a, b) => {
    //     // Sorting by date first
    //     if (a.start_date < b.start_date) return -1;
    //     if (a.start_date > b.start_date) return 1;

    //     // Helper function to get the time in Turkey (after adding 3 hours)
    //     const getTurkeyTimeInMinutes = (dateTimeStr: string, a) => {
    //         console.log(a.name)
    //         const [datePart, timePart] = dateTimeStr.split("T");
    //         const [hour, minute] = timePart.split(":").map(Number);



    //         let adjustedHour = hour + 3;
    //         if (adjustedHour >= 24) adjustedHour -= 24;

    //         console.log(adjustedHour, 'adjusted hour')

    //         return adjustedHour * 60 + minute;
    //     };

    //     const timeA = getTurkeyTimeInMinutes(a.start_time, a);
    //     const timeB = getTurkeyTimeInMinutes(b.start_time, a);

    //     return timeA - timeB;
    // });







    let response: any = [];

    data.map(item => {
        const adjustedTime = new Date(item.start_time);
        adjustedTime.setUTCHours(adjustedTime.getUTCHours() + 3); // Adjusting time to Turkey time

        const timeString = `${String(adjustedTime.getUTCHours()).padStart(2, '0')}:${String(adjustedTime.getUTCMinutes()).padStart(2, '0')}`; // Convert to HH:mm format

        let result = {
            ...item,
            start_time: timeString, // Set the start_time to just the time
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
