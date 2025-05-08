import { MAIL_DISPLAYNAME, MAIL_PASSWORD, MAIL_USERNAME } from '$env/static/private';
import { getUserEmails } from '$lib/server/db/users';
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

export async function broadcastEmail({ subject, body }: { subject: string; body: string }) {
	// Import required functions to get users from the database

	// Get all users' email addresses
	const EVERYONE = await getUserEmails();

	// Ensure we have emails to send to
	if (!EVERYONE || EVERYONE.length === 0) {
		throw new Error('No email recipients found');
	}

	// Use the email service to send the email
	return transporter.sendMail({
		from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
		to: EVERYONE,
		subject: subject,
		text: body
	});
}
