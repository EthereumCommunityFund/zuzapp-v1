
import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../middlewares/withSession";
import { validate_invite_create } from "@/validators/invite.validators";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    // Validate invitation data
    const [validation_result, validatedData] = validate_invite_create(req.body);
    if (validation_result?.error) {
        // log to file
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email)
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const { event_space_id, invitee_email
    } = validatedData;

    console.log(event_space_id, invitee_email)

    // Check for existing invites
    const { data: existingInvite, error: existingInviteError } = await supabase
        .from('eventspaceinvites')
        .select('*')
        .eq('event_space_id', event_space_id)
        .eq('invitee_email', invitee_email)

    console.log(existingInviteError)
    if (existingInviteError) {
        logToFile("server error", existingInviteError.message, existingInviteError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    if (existingInvite.length > 0 && (existingInvite[0].status === 'pending' || existingInvite[0].status === 'accepted')) {
        return res.status(409).json({ invite_status: existingInvite[0].status, message: 'Invite already exists' });
    }

    // check if invite has expired




    const result = await supabase.from('eventspaceinvites').insert({ event_space_id, invitee_email, status: "pending", inviter_id: req.body.user.id }).select("*").single()
    if (result.error) {
        logToFile("server error", result.error.message, result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    // send email
    const inviteLink = `http://${req.headers.host}test/accept-invite?invite_id=${result.data.id}`;

    console.log(inviteLink)



    return res.status(200).json({ message: "Invitation sent" });
};

export default withSession(handler);