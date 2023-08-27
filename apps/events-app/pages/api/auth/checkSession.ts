import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const supabase = createPagesServerClient({ req, res });

    console.log("session ", await supabase.auth.getSession())
}

export default handler