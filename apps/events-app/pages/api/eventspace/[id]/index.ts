import { NextApiRequest, NextApiResponse } from "next";
import withSession from "../../middlewares/withSession";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../../utils/logger";
import { validateUUID } from "../../../../validators";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient({ req, res });
    const { id } = req.query;

    // validate uuid
    const errors = validateUUID(id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }



    const { data, error } = await supabase
        .from('eventspace')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(404).send("Event space not found");
    }

    if (!data) {
        return res.status(404).send("Event space not found");
    }

    return res.status(200).json(data);
};

export default handler;
