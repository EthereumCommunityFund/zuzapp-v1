import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import withSession from "../middlewares/withSession";
import { Database } from "@/database.types";
import { logToFile } from "@/utils/logger";
import { validateLocationCreation } from "@/validators";  // Ensure this path is correct

const createLocationHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    console.log(req.body)

    // Validate location data
    const [validation_result, validatedData] = validateLocationCreation(req.body);
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email);
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const { name, description, is_main_location, address, capacity, image_urls, event_space_id } = validatedData;

    const result = await supabase.from('eventspacelocation').insert({
        event_space_id,
        name,
        description,
        is_main_location: is_main_location || false,
        address,
        capacity,
        image_urls
    }).select("id").single();




    if (result.error) {
        logToFile("server error", result.error.message, 500, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    return res.status(200).json({
        data: result.data.id,
        message: "Location created"
    });
}

export default withSession(createLocationHandler);
