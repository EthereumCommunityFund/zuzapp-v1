

import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../../middlewares/withSession";
import { validate_invite_update } from "@/validators/invite.validators"; // make sure to create this validator
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import { validateUUID } from "@/validators";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });

    const { id } = req.query;

    const errors = validateUUID(req.query.id);
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }


    // Validate the update invite data
    const [validation_result, validatedData] = validate_invite_update(req.body);
    if (validation_result?.error) {
        logToFile("user error", validation_result.error.details[0].message, 400, req.body.user.email)
        return res.status(400).json({ error: validation_result.error.details[0].message });
    }

    const { status } = validatedData;
    // Check the current status of the invite
    const { data: existingInviteArray, error: existingInviteError } = await supabase
        .from('eventspaceinvites')
        .select('status, inviter_id')
        .eq('id', id as string).in('status', ['pending', 'accepted', 'declined'])

    if (existingInviteError) {
        logToFile("server error", existingInviteError.message, existingInviteError.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    if (existingInviteArray.length === 0) {
        return res.status(404).json({ message: "Invitation does not exist" });
    }


    let existingInvite = existingInviteArray[0];
    if (!existingInvite) {
        return res.status(404).json({ message: "Invitation has expired" });
    }

    if (existingInvite.inviter_id === req.body.user.id) {  // Check if inviter_id and invitee_id are the same
        return res.status(400).json({ message: "You cannot invite yourself" });
    }

    if (existingInvite.status === 'accepted' || existingInvite.status === 'declined') {
        return res.status(409).json({ message: "Invitation has expired" });
    }

    // Update the invite status in the database
    const { error } = await supabase
        .from('eventspaceinvites')
        .update({ status, invitee_id: req.body.user.id })
        .eq('id', id as string);

    if (error) {
        logToFile("server error", error.message, error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    return res.status(200).json({ message: `Invitation ${status}` });
};

export default withSession(handler);
