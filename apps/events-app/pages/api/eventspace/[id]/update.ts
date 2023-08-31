import { NextApiRequest, NextApiResponse } from "next"
import withSession from "../../middlewares/withSession"
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"
import { validateEventSpaceUpdate } from "../../../../validation"
import { formatTimestamp } from "../../../../utils"
import { logToFile } from "../../../../utils/logger"






const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const [validation_result, data] = validateEventSpaceUpdate(req.body)
    console.log(validation_result.error, "result")
    if (validation_result.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email)
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    // console.log(data, "req.nodh")

    const supabase = createPagesServerClient({ req, res })
    const { id } = req.query


    let start_date = formatTimestamp(data.start_date);
    let end_date = formatTimestamp(data.end_date)



    const result = await supabase.from('eventspace').update({
        ...data,
        start_date,
        end_date
    }).eq('id', id)


    if (result.error) {
        logToFile("server error", result.error.message, result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    return res.status(result.status).send("Event space updated")


}


export default withSession(handler);