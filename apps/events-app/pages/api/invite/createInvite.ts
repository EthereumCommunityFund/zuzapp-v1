
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
        const mailClient = new MailClient();
        try {
            await mailClient.sendMail(message);
            console.log('Email sent');
        } catch (error) {
            console.error('Error sending email:', error);
        }
        // console.log('Dev environment - email not sent:', message);
        // console.log(message.html)
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

    let { event_space_id, invitee_email
    } = validatedData;

    invitee_email = invitee_email.trim()
    console.log(event_space_id, invitee_email)

    // Check for existing invites
    const { data: existingInvite, error: existingInviteError } = await supabase
        .from('eventspaceinvites')
        .select('*')
        .eq('event_space_id', event_space_id)
        .eq('invitee_email', invitee_email.trim()).in('status', ['pending', 'accepted'])

    if (existingInviteError) {
        logToFile("server error", existingInviteError.message, existingInviteError.code, req.body.user.email);
        return res.status(500).send("Internal server error");
    }

    let { data: event_space, error: event_space_error } = await supabase.from('eventspace').select('name').eq('id', event_space_id).single();

    if (!event_space) {
        return;
    }

    if (existingInvite.length > 0) {
        const status = existingInvite[0].status;
        if (status === 'pending') {
            const inviteLink = `http://${req.headers.host}/dashboard/events/accept-invite?invite_id=${existingInvite[0].id}`;
            const logo_img_link = `http://${req.headers.host}/_next/image?url=%2Fimages%2FLogo.png&w=384&q=75`

            const message = {
                from: "noreply@zuzalu.city",
                to: existingInvite[0].invitee_email.trim(),
                subject: "You have been invited to collaborate on Zuzapp",
                html: getEmailTemplate(event_space.name, inviteLink, logo_img_link)
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
    const logo_img_link = `http://${req.headers.host}/_next/image?url=%2Fimages%2FLogo.png&w=384&q=75`
    const message = {
        from: "noreply@zuzalu.city",
        to: invitee_email.trim(),
        subject: "You have been invited to collaborate on Zuzapp",
        text: "",
        html: getEmailTemplate(event_space.name, inviteLink, logo_img_link),
    };

    await processInvite(message);
    return res.status(200).json({ message: "Invitation sent" });






};

export default withSession(withAuthorization(handler));




const getEmailTemplate = (event_space_name: string, invite_link: string, logo_img_link: string) => {


    return `
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> 
<head> 
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"> 
	<meta name="viewport" content="width=device-width,initial-scale=1"> 
	<meta http-equiv="X-UA-Compatible" content="IE=Edge"/> 
	<meta name="x-apple-disable-message-reformatting"> 
	<title>Invite to Collaborate</title> 
	<style>html{-webkit-text-size-adjust:none;-ms-text-size-adjust:none}@media only screen and (max-device-width:600px),only screen and (max-width:600px){.mob_100{width:100%!important;max-width:100%!important}.mob_full{width:auto!important;display:block!important;padding:0 10px!important}.mob_center{text-align:center!important}.mob_center_bl{margin-left:auto;margin-right:auto}.mob_hidden{display:none!important}.only_mob{display:block!important}}@media only screen and (max-width:600px){.mob_100{width:100%!important;max-width:100%!important}.mob_100 img,.mob_100 table{max-width:100%!important}.mob_full{width:auto!important;display:block!important;padding:0 10px!important}.mob_center{text-align:center!important}.mob_center_bl{margin-left:auto;margin-right:auto}.mob_hidden{display:none!important}.only_mob{display:block!important}}.creative{width:100%!important;max-width:100%!important}.mail_preheader{display:none!important}form input, form textarea{font-family: Arial, sans-serif;width: 100%;box-sizing: border-box;font-size: 13px;color:#000000;outline:none;padding: 0px 15px;}form textarea{resize:vertical;line-height: normal;padding: 10px 15px;}form button{border: 0px none;cursor:pointer;}</style> 

	</head> 
	<body class="body" style="padding:0;margin:0"> 
	<div class="full-wrap"> 
	<table width="100%" border="0" cellspacing="0" cellpadding="0" class="full-wrap">
	<tr><td align="center" bgcolor="#e5e5e5" style="line-height: normal; hyphens: none;">
	<div>
	<!--[if !mso]>
	<!-->
	<div class="mail_preheader" style="font-size: 0px; color: transparent; opacity: 0;">
		<span style="font-family: Arial, Helvetica, sans-serif; font-size: 0px; color: transparent; line-height: 0px;"></span>
	</div>
	<!--
	<![endif]-->
</div>  
<div>
	<table border="0" cellspacing="0" cellpadding="0" width="100%" style="max-width: 640px;">
	<tr><td align="left" valign="top" bgcolor="#f5f5f5" style="padding: 32px;">
		<div>
			<div>
				<table border="0" cellspacing="0" cellpadding="0" width="100%">
				<tr><td align="left" valign="top" style="padding: 20px 32px;">
					<div>
						<div>
						
							<table border="0" cellspacing="0" cellpadding="0" width="100%" style="max-width: 200px;">
							<tr><td align="center" valign="middle" height="70" style="height: 70px;">
								<div>
									<div>
										<a href="${invite_link}" target="_blank" style="font-family: Arial, sans-serif; font-size: 14px; color: #000000;"><img src="${logo_img_link}" width="200" alt="" border="0" style="display: block; max-width: 200px; width: 100%;" class="w200px"></a>
									</div>
								</div>
							</td></tr>
							</table>
		
						</div>
					</div>
				</td></tr>
				</table>
			</div> 
			<div>
				<table border="0" cellspacing="0" cellpadding="0" width="100%">
				<tr><td align="left" valign="top" bgcolor="#ffffff" style="padding: 32px; border-radius: 20px; border-width: 1px; border-color: #e6e6e6; border-style: solid;">
					<div>
						<div style="line-height: 24px;">
							<span style="font-family: Inter, sans-serif; font-weight: bold; font-size: 20px; color: #1a2229;">You’ve been invited to collaborate</span>
						</div> 
						<div style="height: 40px; line-height: 40px; font-size: 38px;">&nbsp;</div>
						<div>
							<table border="0" cellspacing="0" cellpadding="0" width="100%">
							<tr><td align="left" valign="top">
								<div>
									<div>
										<table border="0" cellspacing="0" cellpadding="0" width="100%">
										<tr><td align="left" valign="top">
											<div>
												<div style="line-height: 24px;">
													<span style="font-family: Inter, sans-serif; font-size: 16px; color: #7d7d7d;">you’ve been invited to the event space below:</span>
												</div> 
												<div style="height: 20px; line-height: 20px; font-size: 18px;">&nbsp;</div>
												<div>
								
													<a target="_blank" href="" style="background-color:#f8f8f8;font-size:18px;font-weight:normal;line-height:42px;width:100%;border: 1px solid #dcdcdc;color:#505050;border-radius:10px;display:inline-block;font-family:Inter, sans-serif;text-align:center;text-decoration:none;-webkit-text-size-adjust:none;box-sizing:border-box;mso-hide:all">${event_space_name}</a>
												</div>
											</div>
										</td></tr>
										</table>
									</div> 
									<div style="height: 20px; line-height: 20px; font-size: 18px;">&nbsp;</div>
									<div>
									
										<table border="0" cellspacing="0" cellpadding="0" width="100%" style="max-width: 171px;">
										<tr><td align="center" valign="middle" bgcolor="#83d2b1" style="padding: 10px 14px; border-radius: 20px;">
											<div>
												<table border="0" cellspacing="0" cellpadding="0" width="100%">
												<tr><td align="left" valign="top" width="20" style="width: 20px; padding: 0px 8px 0px 0px;">
												
												</td> 
												<td align="center" valign="middle">
													<div style="line-height: 22px;">
														<a href="${invite_link}" style="font-family: Inter, sans-serif; font-weight: bold; font-size: 18px; color: #ffffff;">Accept Invite</a>
													</div>
												</td></tr>
												</table>
											</div>
										</td></tr>
										</table>
						
									</div>
								</div>
							</td></tr>
							</table>
						</div> 
						<div style="height: 40px; line-height: 40px; font-size: 38px;">&nbsp;</div>
						<div>
							<table border="0" cellspacing="0" cellpadding="0" width="100%">
							<tr><td align="left" valign="top" style="padding: 20px 0px 0px; border-top: 1px solid #000000;">
								<div>
									<div style="line-height: 24px;">
										<span style="font-family: Inter, sans-serif; font-weight: bold; font-size: 14px; color: #7d7d7d;">or click on the link below</span>
									</div> 
									<div style="height: 10px; line-height: 10px; font-size: 8px;">&nbsp;</div>
									<div style="line-height: 24px;">
										<span style="font-family: Inter, sans-serif; font-size: 13px; color: #333333;"><a href="${invite_link}" target="_blank" style="color: #333333; text-decoration: underline; word-break: break-all;">${invite_link}</a></span>
									</div>
								</div>
							</td></tr>
							</table>
						</div>
					</div>
				</td></tr>
				</table>
			</div>
		</div>
	</td></tr>
	</table>
</div>
</td></tr>
</table> 
</div> 
</body> 
</html> 

    `

}