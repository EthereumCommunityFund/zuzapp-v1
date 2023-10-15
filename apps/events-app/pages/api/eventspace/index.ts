import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/database.types";
import { logToFile } from "../../../utils/logger";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Get the total count of published eventspaces
    const { count } = await supabase
        .from('eventspace')
        .select('id', { count: 'exact' })
        .filter('status', 'eq', 'published');

    const { data, error } = await supabase
        .from('eventspace')
        .select(`
        *,
        eventspacelocation: eventspacelocation (id, name, is_main_location, description, address, capacity, image_urls),
        tracks: track (*),
        schedules: schedule (*)
        `)
        .filter('status', 'eq', 'published')
        .limit(limit)
        .range(offset, offset + limit - 1)
        .order('start_date', { ascending: true });;

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(500).send("Server error");
    }

    return res.status(200).json({ data, currentPage: page, limit: limit, totalCount: count });
};

export default handler;
