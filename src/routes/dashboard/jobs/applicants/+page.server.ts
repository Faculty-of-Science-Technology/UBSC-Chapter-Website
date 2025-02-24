import { MAIL_DISPLAYNAME, MAIL_PASSWORD, MAIL_USERNAME } from '$env/static/private';
import { db } from '$lib/server/db';
import { JobApplications, Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect, type Actions, type ServerLoad } from '@sveltejs/kit';
import { and, count, eq } from 'drizzle-orm';
import nodemailer from 'nodemailer';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const EmployerResponse = z.object({
	application_id: z
		.string({
			required_error:
				'Something happened on our end. Try checking over your response and submit again.'
		})
		.min(1, {
			message: 'Something happened on our end. Try checking over your response and submit again.'
		}),
	response_name: z
		.string({ required_error: 'Response name must be at least 1 character long' })
		.min(1, { message: 'Response name must be at least 1 character long' }),
	response_message: z
		.string({ required_error: 'Response message must be at least 1 character long' })
		.min(1, { message: 'Response message must be at least 1 character long' })
});

const DeclinedReason = z.object({
	application_id: z.string().min(1, {
		message: 'Something happened on our end. Try checking over your response and submit again.'
	}),
	decline_reason: z.string().default('No reason provided.')
});

export const load: ServerLoad = async (event) => {
	const url = event.url;
	const query = url.searchParams;
	// Try to coerce the page query parameter to a number
	// const cookies = event.cookies;
	let page = parseInt(query.get('page') ?? '');
	const job_id = query.get('job_id');
	const user = event.locals.user;
	if (!user) throw redirect(301, '/auth/login');
	// Check to ensure the page query parameter is a number

	// Initialize both forms whether we need them or not
	const messageForm = await superValidate(zod(EmployerResponse));
	const declineForm = await superValidate(zod(DeclinedReason));

	if (isNaN(page) || page < 1) {
		page = 1;
	}

	const offset = page ? (page - 1) * 10 : 0; // Offset is 0 if page is 1, otherwise it's 10 * (page - 1)
	// ...since we're showing 10 data entries per page

	if (!job_id) {
		// If we don't have a job_id, get all the jobs the user owns instead
		// Get total number of jobs owned by the user
		// Get all jobs and populate
		const jobs = await db
			.select({
				Jobs,
				Users,
				JobTypes,
				totalApplications: count(JobApplications.Id)
			})
			.from(Jobs)
			.leftJoin(Users, eq(Jobs.UserId, Users.Id))
			.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
			.innerJoin(JobApplications, eq(Jobs.Id, JobApplications.JobsId)) // Inner join to get only jobs with applications
			.where(eq(Jobs.UserId, user.Id)) // Only get jobs owned by the current user
			.groupBy(Jobs.Id, Users.Id, JobTypes.Id)
			.offset(offset) // Move forward by the offset
			.limit(10); // Stop after 10 jobs

		const dataLength = jobs.length;

		return {
			user,
			dataLength,
			jobApplications: undefined,
			jobs,
			job: undefined,
			offset: page,
			messageForm,
			declineForm
		};
	}

	// Get all job applications
	// The total number of jobs stored in the database
	const dataLength = await db
		.select({ count: count() })
		.from(JobApplications)
		.where(and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, user.Id)))
		.then((res) => res[0].count);

	const job = await db
		.select()
		.from(Jobs)
		.where(eq(Jobs.Id, job_id))
		.then((res) => res[0]);

	// Get all submitted applications and populate
	const jobApplications = await db
		.select()
		.from(JobApplications)
		.leftJoin(Jobs, eq(JobApplications.JobsId, Jobs.Id))
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.where(and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, user.Id)))
		.offset(offset) // Move forward by the offset
		.limit(10); // Stop after 10 jobs

	return {
		user,
		dataLength,
		jobApplications,
		jobs: undefined,
		job,
		offset: page,
		messageForm,
		declineForm
	};
};

export const actions: Actions = {
	sendResponse: async (event) => {
		const formData = await event.request.formData();
		const { cookies } = event;
		const job_id = cookies.get('job_id');
		const messageForm = await superValidate(formData, zod(EmployerResponse));
		try {
			EmployerResponse.parse(messageForm.data);
		} catch {
			// console.log(e, messageForm);
			// Return all the errors back
			return { messageForm };
		}

		// Check if the user is logged in
		const user = event.locals.user;
		if (!user) {
			setError(messageForm, 'application_id', 'You must be logged in to perform this action.');
			return { messageForm };
		}
		if (!job_id) {
			setError(messageForm, 'Job not found');
			return { messageForm };
		}

		// But do we own this job?
		const job = await getJob(job_id, user.Id);
		if (!job) {
			setError(messageForm, 'Job not found');
			return { messageForm };
		}

		// Find the application for this job
		const application = await db
			.select()
			.from(JobApplications)
			.where(and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, user.Id)))
			.then((res) => res[0]);

		if (!application?.UserId) {
			setError(messageForm, 'application_id', 'Application not found');
			return { messageForm };
		}

		// Find the applicant we're trying to contact
		const applicant = await db
			.select()
			.from(Users)
			.where(eq(Users.Id, application.UserId))
			.then((res) => res[0]);

		if (!applicant) {
			setError(messageForm, 'application_id', 'Applicant not found');
			return { messageForm };
		}

		// Spin up nodemailer
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: MAIL_USERNAME,
				pass: MAIL_PASSWORD
			}
		});

		transporter.sendMail({
			from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
			to: applicant.Email,
			subject:
				'[Follow-Up]:' +
				' ' +
				user.FirstName +
				' ' +
				user.LastName +
				' has responded to your job application for position' +
				' ' +
				job.Title,

			// The newlines absent in the HTML matter for proper formatting of the email, and are intentional
			html: `
			
			<code style="background-color:#f4f4f4;padding-left:1rem;padding-top:1rem;padding-bottom:1rem;display:block;border-radius:5px;border-width:1px;border-style:solid;border-color:#ddd;">Context you may need to know:<div style="display: block"><h3>Job Title:&nbsp;${job.Title}</h3><h3>Representative:&nbsp;${messageForm.data.response_name}</h3></div>
			
			<strong>NOTICE:</strong>&nbsp;Conversations outside of this platform are not monitored and is at your own discretion. Please be cautious when sharing personal information. The Platform is not responsible or will be held accountable for any damages or losses incurred from conversations outside of the platform.
			</code>
			<code style="background-color:#f4f4f4;padding-left:1rem;padding-top:1rem;padding-bottom:1rem;display:block;border-radius:5px;border-width:1px;border-style:solid;border-color:#ddd;">${messageForm.data.response_message}</code>
			---
			You can reply to this email to discuss further and get in touch with the representative.

			You received this email because you applied for a job on our platform.
			If you believe this email was sent in error,&nbsp;please ignore this email.
			`
				.trim()
				.replace(/\r\n?|\n/g, '<br/>')
				.replace(/[^\S](?<!\b \b|[.,!?;:])(?=\p{L})/gu, '&nbsp;') // Remove extra spaces and make HTML friendly
				.replace(/[^\S\r\n](?<!\b \b)/g, ''),

			replyTo: user.Email
		});

		// Set the job application status to ACCEPTED
		await db
			.update(JobApplications)
			.set({ Status: 'approved' })
			.where(eq(JobApplications.Id, application.Id));
		return setMessage(messageForm, 'Message sent successfully');
	},
	decline: async (event) => {
		const formData = await event.request.formData();
		const { cookies } = event;
		const job_id = cookies.get('job_id');
		const declineForm = await superValidate(formData, zod(DeclinedReason));
		try {
			DeclinedReason.parse(declineForm.data);
		} catch (e) {
			console.log(e, declineForm);
			// Return all the errors back
			return { declineForm };
		}

		// Check if the user is logged in
		const user = event.locals.user;
		if (!user) {
			setError(declineForm, 'You must be logged in to perform this action.');
			return { declineForm };
		}
		if (!job_id) {
			setError(declineForm, 'Job not found');
			return { declineForm };
		}

		// But do we own this job?
		const job = await getJob(job_id, user.Id);
		if (!job) {
			setError(declineForm, 'Job not found');
			return { declineForm };
		}
		// Find the application for this job
		const application = await db
			.select()
			.from(JobApplications)
			.where(and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, user.Id)))
			.then((res) => res[0]);

		if (!application?.UserId) {
			setError(declineForm, 'application_id', 'Application not found');
			return { declineForm };
		}

		// Find the applicant we're trying to contact
		const applicant = await db
			.select()
			.from(Users)
			.where(eq(Users.Id, application.UserId))
			.then((res) => res[0]);

		if (!applicant) {
			setError(declineForm, 'application_id', 'Applicant not found');
			return { declineForm };
		}

		// Spin up nodemailer
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: MAIL_USERNAME,
				pass: MAIL_PASSWORD
			}
		});

		transporter.sendMail({
			from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
			to: applicant.Email,
			subject: '[Notice]:' + ' ' + 'Application rejected for position' + ' ' + job.Title,
			text: `We're sorry, but your application for the job position has been rejected for the position ${job.Title} because:\n\n${declineForm.data.decline_reason}`
		});

		// Set the job application status to DECLINED
		await db
			.update(JobApplications)
			.set({ Status: 'rejected' })
			.where(eq(JobApplications.Id, application.Id));

		return setMessage(declineForm, 'Job application declined');
	}
};

const getJob = async (job_id: string, userId: string): Promise<typeof Jobs | undefined> => {
	return (await db
		.select()
		.from(Jobs)
		.where(and(eq(Jobs.Id, job_id), eq(Jobs.UserId, userId)))
		.limit(1)
		.then((res) => res[0])) as typeof Jobs | undefined;
};
