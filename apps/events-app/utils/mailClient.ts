const nodemailer = require('nodemailer')
const mailgunTransport = require('nodemailer-mailgun-transport')

const mailgunOptions = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    }
}

class MailClient {
    transporter: any;

    constructor() {
        const transport = mailgunTransport(mailgunOptions)
        this.transporter = nodemailer.createTransport(transport, []);
    }

    async sendMail(message: any) {
        let promise = new Promise((resolve, reject) => {
            this.transporter.sendMail(message, (err: any, info: any) => {
                console.log(err, info)
                if (err) {
                    reject(err)
                } else {
                    resolve("")

                }
            });
        })

        return await promise;
    }
}

export default MailClient

