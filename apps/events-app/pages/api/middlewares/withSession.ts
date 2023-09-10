import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; import { Database } from "@/database.types";
import { NextApiRequest, NextApiResponse } from "next";

const withSession = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const supabase = createPagesServerClient<Database>({ req, res });
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
            return res.status(401).send("Unathourized access")
        }
        let user = data.session?.user;
        req.body = {
            ...req.body,
            user
        }
        return handler(req, res);
    }
}

export default withSession;