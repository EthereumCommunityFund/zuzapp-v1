
import { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import withSession from "../middlewares/withSession";
import { validate_invite_create } from "@/validators/invite.validators";
import { logToFile } from "@/utils/logger";
import { Database } from "@/database.types";
import withAuthorization from "../middlewares/withAuthorization";
import MailClient from "@/utils/mailClient";

const processInvite = async (message: any) => {
    if (process.env.NODE_ENV === 'production') {
        const mailClient = new MailClient();
        try {
            await mailClient.sendMail(message);
            console.log('Email sent');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    } else {
        console.log('Dev environment - email not sent:', message);
        console.log(message.html)
    }
};

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
        .eq('invitee_email', invitee_email).in('status', ['pending', 'accepted'])

    if (existingInviteError) {
        logToFile("server error", existingInviteError.message, existingInviteError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    // console.log(existingInvite, "existing invite")
    if (existingInvite.length > 0) {
        const status = existingInvite[0].status;
        if (status === 'pending') {
            const inviteLink = `http://${req.headers.host}test/accept-invite?invite_id=${existingInvite[0].id}`;
            const message = {
                from: process.env.EMAIL_FROM,
                to: existingInvite[0].invitee_email,
                subject: "You have been invited to collaborate on Zuzapp",
                html: `Follow this link to accept the invite <br/> <p>${inviteLink}</p>`,
            };
            await processInvite(message);
            return res.status(200).json({ message: "Invitation re-sent" });
        }
        else if (status === 'accepted') {
            return res.status(409).json({ invite_status: status, message: 'Invite already exists' });
        }
    }

    // ToDo check if invite has expired


    const result = await supabase.from('eventspaceinvites').insert({ event_space_id, invitee_email, status: "pending", inviter_id: req.body.user.id }).select("*").single()
    if (result.error) {
        logToFile("server error", result.error.message, result.error.code, req.body.user.email)
        return res.status(500).send("Internal server error");
    }

    const inviteLink = `http://${req.headers.host}/dashboard/events/accept-invite?invite_id=${result.data.id}`;
    const message = {
        from: "victor@ecf.network",
        to: invitee_email,
        subject: "You have been invited to collaborate on Zuzapp",
        text: "",
        html: `Follow this link to accept the invite <br/> <p>${inviteLink}</p>`,
    };

    await processInvite(message);
    return res.status(200).json({ message: "Invitation sent" });



    // try {
    //     const resulter = await mailClient.sendMail(message)
    //     console.log(resulter, "result");
    //     return res.status(200).json({ message: "Invitation sent" });
    // } catch (error) {
    //     return res.status(500).send("Error sending email");
    // }




};
""

export default withSession(withAuthorization("creator", handler));