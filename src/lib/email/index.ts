import { MAIL_DISPLAYNAME, MAIL_PASSWORD, MAIL_USERNAME } from '$env/static/private';
import nodemailer from 'nodemailer';
// Fire up nodemailer
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: MAIL_USERNAME,
		pass: MAIL_PASSWORD
	}
});

interface SendMailOptions {
	from: string | undefined;
	to: string;
	subject: string;
	body: string;
}

export async function sendMail({ from, to, subject, body }: SendMailOptions) {
	// Use the email service to send the email
	await transporter.sendMail({
		from: from ?? `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
		to: to,
		subject: subject,
		text: body
	});
}
