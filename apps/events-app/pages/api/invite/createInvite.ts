
import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../middlewares/withSession";
import { validate_invite_create } from "@/validators/invite.validators";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import withAuthorization from "../middlewares/withAuthorization";
import mailClient from "@/utils/mailClient";
import { resolve } from "path";
import MailClient from "@/utils/mailClient";

const sendInviteEmail = async (mailClient: MailClient, to_email: string, inviteId: string, host: any) => {
    const inviteLink = `http://${host}/test/accept-invite?invite_id=${inviteId}`;

    const message = {
        from: process.env.EMAIL_FROM,
        to: to_email,
        subject: "You have been invited to collaborate on Zuzapp",
        html: `<p>${inviteLink}</p>`,
    };

    try {
        await mailClient.sendMail(message);
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const supabase = createPagesServerClient<Database>({ req, res });
    const mailClient = new MailClient();
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

    if (existingInviteError) {
        logToFile("server error", existingInviteError.message, existingInviteError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }


    if (existingInvite.length > 0) {
        const status = existingInvite[0].status;

        if (status === 'pending') {
            const emailResult = await sendInviteEmail(mailClient, existingInvite[0].invitee_email, existingInvite[0].id, req.headers.host);
            if (emailResult.success) {
                return res.status(200).json({ message: "Invitation re-sent" });
            } else {
                return res.status(500).send("Error resending email");
            }
        } else if (status === 'accepted') {
            return res.status(409).json({ invite_status: status, message: 'Invite already exists' });
        }
    }

    // ToDo check if invite has expired



    const result = await supabase.from('eventspaceinvites').insert({ event_space_id, invitee_email, status: "pending", inviter_id: req.body.user.id }).select("*").single()
    if (result.error) {
        logToFile("server error", result.error.message, result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    const inviteLink = `http://${req.headers.host}test/accept-invite?invite_id=${result.data.id}`;

    const message = {
        from: "victor@ecf.network",
        to: "onyejivic@gmail.com",
        subject: "You have been invited to collaborate on Zuzapp",
        text: "",
        html: `<p>${inviteLink}</p>`,
    };



    try {
        const resulter = await mailClient.sendMail(message)
        console.log(resulter, "result");
        return res.status(200).json({ message: "Invitation sent" });
    } catch (error) {
        return res.status(500).send("Error sending email");
    }




};


export default withSession(withAuthorization("creator", handler));