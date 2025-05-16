import { MAIL_DISPLAYNAME, MAIL_PASSWORD, MAIL_USERNAME } from '$env/static/private';
import { getUserEmails } from '$lib/server/db/users';
import nodemailer from 'nodemailer';
// Fire up nodemailer
const CHUNK_SIZE = 100;
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	pool: true,
	maxMessages: Infinity,
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
	bcc?: boolean | undefined;
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

export async function broadcastEmail({
	subject,
	body,
	bcc
}: {
	subject: string;
	body: string;
	bcc?: boolean;
}) {
	// Import required functions to get users from the database

	// Get all users' email addresses
	const EVERYONE = await getUserEmails();

	// Ensure we have emails to send to
	if (!EVERYONE || EVERYONE.length === 0) {
		throw new Error('No email recipients found');
	}

	// Define chunk size
	const results = [];
	
	// Split emails into chunks and send them
	for (let i = 0; i < EVERYONE.length; i += CHUNK_SIZE) {
		const chunk = EVERYONE.slice(i, i + CHUNK_SIZE);
		
		// Use the email service to send the email to current chunk
		const result = await transporter.sendMail({
			from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
			bcc: bcc ? chunk : undefined,
			to: bcc ? undefined : chunk,
			subject: subject,
			text: body
		});
		
		results.push(result);
		
		// Add a small delay between chunks to avoid overwhelming the mail server
		if (i + CHUNK_SIZE < EVERYONE.length) {
			await new Promise(resolve => setTimeout(resolve, 3000));
		}
	}
	
	return {
		success: true,
		totalRecipients: EVERYONE.length,
		chunksCount: Math.ceil(EVERYONE.length / CHUNK_SIZE),
		results
	};
}
