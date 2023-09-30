import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; import { Database } from "@/database.types";
import { NextApiRequest, NextApiResponse } from "next";
import { validateUUID } from "@/validators";

const withSession = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const supabase = createPagesServerClient<Database>({ req, res });
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
            return res.status(401).send("Unathourized access")
        }
        let user = data.session?.user;

        const errors = validateUUID(user.id);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        req.body = {
            ...req.body,
            user
        }
        return handler(req, res);
    }
}

export default withSession;