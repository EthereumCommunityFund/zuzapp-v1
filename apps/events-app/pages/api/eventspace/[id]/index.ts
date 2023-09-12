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

    // Fetch EventSpace and associated EventSpaceLocation data
    const { data, error } = await supabase
        .from('eventspace')
        .select(`
            *,
            eventspacelocation: eventspacelocation (id, name, is_main_location, description, address, capacity, image_urls)
        `)
        .eq('id', id)
        .single();

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Event space not found");
    }
    console.log(data, "gotten location")

    if (!data) {
        return res.status(404).send("Event space not found");
    }

    return res.status(200).json(data);
};

export default handler;



