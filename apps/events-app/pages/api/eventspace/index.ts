import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { logToFile } from "../../../utils/logger";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient({ req, res });

    const { data, error } = await supabase
        .from('eventspace')
        .select('*');

    if (error) {
        logToFile("server error", error.message, error.code, "Unknown user");
        return res.status(500).send("Server error");
    }

    return res.status(200).json(data);
};

export default handler;
