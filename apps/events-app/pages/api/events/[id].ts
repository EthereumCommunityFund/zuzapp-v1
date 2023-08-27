import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../../middleware/withSession"


const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    console.log('got to this handler')
}


export default withSession(handler)