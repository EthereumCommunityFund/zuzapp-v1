import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";
import { Database } from "@/database.types";
import { QueryWithID } from "@/types";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const { id } = req.query as QueryWithID;

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Fetch EventSpace first to determine the type
    const eventSpaceResult = await supabase
        .from('eventspace')
        .select('event_space_type')
        .eq('id', id)
        .single();

    if (!eventSpaceResult.data) {
        return res.status(404).send("Event space not found");
    }

    let selectString = `*,
    eventspacelocation: eventspacelocation (id, name, is_main_location, description, address, capacity, image_urls)`;

    console.log(eventSpaceResult)
    // Modify the query based on the event_space_type
    if (eventSpaceResult.data.event_space_type === 'schedules') {
        selectString += `, schedules: schedule (*)`;
    } else if (eventSpaceResult.data.event_space_type === 'tracks') {
        selectString += `,
        tracks: track (*),
        schedules: schedule (*)`;
    }

    // Fetch the additional data based on the event_space_type
    const { data, error } = await supabase
        .from('eventspace')
        .select(selectString)
        .eq('id', id)
        .single();

    console.log(data)

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Event space not found");
    }
    console.log(data, "gotten location and tracks or schedules")

    if (!data) {
        return res.status(404).send("Event space not found");
    }

    return res.status(200).json({ data });
};


export default handler;


