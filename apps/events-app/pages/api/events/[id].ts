import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../../middleware/withSession"


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    console.log(req, res)
}


export default handler;