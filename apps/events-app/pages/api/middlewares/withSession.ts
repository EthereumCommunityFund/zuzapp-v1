import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const withSession = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const supabase = createPagesServerClient({ req, res });
        const { data, error } = await supabase.auth.getSession()
        let user = data.session?.user;

        if (!data.session) {
            return res.status(401).send("Unathourized access")
        }


        req.body = {
            ...req.body,
            user
        }
        return handler(req, res);
    }
}

export default withSession;