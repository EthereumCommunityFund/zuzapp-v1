import { NextApiHandler } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const withSession = (handler: NextApiHandler) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        const supabase = createPagesServerClient({ req, res });
        const session = await supabase.auth.getSession()

        if (!session) {
            return res.status(401).send("Unathourized access")
        }
        handler(req, res)
    }





}

export default withSession;