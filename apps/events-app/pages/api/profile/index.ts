import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";
import { validateUUID } from "../../../validators";
import { Database } from "@/database.types";
import { QueryWithID } from "@/types";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    // Fetch Profile first to determine the type
    const profile = await supabase
        .from('profile')
        .select('*')
        .eq('uuid', req.body.user.id)
        .single();

    console.log(profile)

    if (!profile.data) {
        return res.status(404).send("Profile not found");
    }

    return res.status(200).json({ data: profile.data });
};


export default withSession(handler);


