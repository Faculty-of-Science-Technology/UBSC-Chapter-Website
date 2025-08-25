import { MAIL_DISPLAYNAME, MAIL_USERNAME, PLATFORM_NAME } from '$env/static/private';
import { sendMail } from '$lib/email';
import { fail, setError, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const contactSchema = z.object({
	name: z.string().min(1, { message: 'Name is required' }).trim(),
	email: z.string().email({ message: 'Invalid email address' }).trim(),
	subject: z.string().min(1, { message: 'Subject is required' }).trim(),
	category: z.string().optional(),
	message: z.string().min(10, { message: 'Message must be at least 10 characters long' }).trim()
});

export const load: PageServerLoad = async (request) => {
	const form = await superValidate(request, zod(contactSchema));
	
	return {
		form
	};
};

export const actions: Actions = {
	sendMessage: async ({ request }) => {
		const form = await superValidate(request, zod(contactSchema));

		if (!form.valid) {
			setError(form, '', 'Please check your form for errors and try again.');
			return fail(400, { form });
		}

		try {
			// Send email to the chapter
			await sendMail({
				from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
				to: 'ubsc@ub.edu.bz', // Chapter email
				subject: `Contact Form: ${form.data.subject}`,
				body: `
New message from the UBSC Chapter website:

Name: ${form.data.name}
Email: ${form.data.email}
Category: ${form.data.category || 'General Inquiry'}
Subject: ${form.data.subject}

Message:
${form.data.message}

---
This message was sent from the ${PLATFORM_NAME} contact form.
				`.trim()
			});

			// Send confirmation email to the sender
			await sendMail({
				from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
				to: form.data.email,
				subject: `Thank you for contacting ${PLATFORM_NAME}`,
				body: `
Dear ${form.data.name},

Thank you for reaching out to the University of Belize ACM Chapter. We have received your message regarding "${form.data.subject}" and will get back to you as soon as possible.

Your message:
${form.data.message}

We typically respond within 24-48 hours during business days. If your inquiry is urgent, please don't hesitate to call us at +501 223-7040.

Best regards,
${PLATFORM_NAME} Team
				`.trim()
			});

			setMessage(form, 'Thank you for your message! We will get back to you soon.');
			return { success: true, form };
		} catch (error) {
			console.error('Error sending contact form email:', error);
			setError(form, '', 'Sorry, there was an error sending your message. Please try again or contact us directly.');
			return fail(500, { form });
		}
	}
};
