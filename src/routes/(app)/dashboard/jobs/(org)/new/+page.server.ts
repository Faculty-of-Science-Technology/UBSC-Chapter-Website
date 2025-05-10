import {
	DEBUG,
	IS_DEVELOPMENT,
	JWT_SECRET,
	MAIL_SIGNATURE,
	PLATFORM_URL,
	PLATFORM_URL_DEVELOPMENT
} from '$env/static/private';
import { broadcastEmail } from '$lib/email';
import { db } from '$lib/server/db';
import { Jobs, Questions } from '$lib/server/db/schema';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Jwt from 'jsonwebtoken';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const jobSchema = z.object({
	title: z
		.string({ required_error: 'You must define a job title' })
		.min(1, { message: 'Your job title is too short' })
		.max(255, { message: 'Your job title is too long' }),
	description: z
		.string({ required_error: 'You must define a job description' })
		.min(1, { message: 'Your job description is too short' }),
	min_rate: z.coerce.number().min(1),
	max_rate: z.coerce.number().min(2),
	job_type: z.coerce
		.number({ required_error: 'You must define a job type' })
		.min(1, { message: 'Invalid job type' })
		.max(3, { message: 'Invalid job type' }),
	draft: z.coerce.boolean({
		required_error: 'Something happened on our end, try that one more time'
	}),
	broadcast_job: z.enum(['on', 'off'], {
		required_error: 'Something happened on our end, try that one more time'
	})
	// userId: z.string().uuid() // Generated on submit by the server
});

const questionSchema = z.object({
	question_content: z
		.string({ required_error: "You can't create an empty question" })
		.trim()
		.min(1, { message: 'Your question is too short' })
		.max(255, { message: 'Your question is too long' }),
	question_type: z.enum(['true-false', 'short-answer'], {
		required_error: 'You must choose a question type'
	})
	// draft: z.boolean() // Generated on submit by the server
});

const removeQuestionSchema = z.object({
	question_id: z.number({ required_error: 'Something went wrong, try again' })
});

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(301, '/auth/login');
	}
	// Get page query parameters
	const { cookies, url } = event;
	cookies.delete('job_id', { path: '/' });
	const query = new URLSearchParams(url.search);
	const job_id = query.get('job_id');

	if (job_id) {
		// Set the cookie
		cookies.set('job_id', job_id, { path: '/' });
		// Lookup the job
		const job = await db.select().from(Jobs).where(eq(Jobs.Id, job_id));
		if (!job) throw redirect(301, '/dashboard/');
		const job_found = job[0];

		// Check if the user is the owner of the job
		if (job_found.UserId !== event.locals.user.Id) throw redirect(301, '/dashboard/');

		// Map the job to the form
		const mapped_job = {
			title: job_found.Title,
			description: job_found.Description,
			min_rate: job_found.MinRate,
			max_rate: job_found.MaxRate,
			job_type: job_found.JobTypeId ?? 1, // Default to 1 if null
			draft: job_found.Draft,
			broadcast_job: 'off' as 'on' | 'off' | undefined // Default to false
		};

		const jobForm = await superValidate(mapped_job, zod(jobSchema));
		const questionForm = await superValidate(zod(questionSchema));
		// Return all the questions for the job
		const questions = await db.select().from(Questions).where(eq(Questions.JobsId, job_id));

		return { jobForm, questions, questionForm };
	}
	const jobForm = await superValidate(zod(jobSchema));
	const questionForm = await superValidate(zod(questionSchema));
	return { jobForm, questionForm, user: event.locals.user };
};

export const actions: Actions = {
	createJob: async (event) => {
		const user = event.locals.user;

		if (user !== null && user !== undefined) {
			if (user.AccountType !== 'org' && user.AccountType !== 'owner') {
				throw error(403, 'Forbidden');
			}
		} else {
			throw redirect(301, '/auth/login');
		}
		const formData = await event.request.formData();
		const { cookies } = event;
		const session = cookies.get('session');

		// Check if the user is authenticated
		if (!session) throw redirect(301, '/auth/login');

		try {
			const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
			if (!jwt) throw redirect(301, '/auth/login');
		} catch {
			throw redirect(301, '/auth/login');
		}

		const jobForm = await superValidate(formData, zod(jobSchema));
		const job_id = cookies.get('job_id') ?? null;
		if (!user) throw redirect(301, '/auth/login');
		if (JSON.parse(DEBUG) ?? JSON.parse(IS_DEVELOPMENT)) {
			console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
			console.log('To disable this, set DEBUG to false in your .env file');
			console.log('form', formData);
		}

		if (!jobForm.valid) {
			setError(jobForm, '', 'You have some errors in your form. Please fix them and try again.');
			return fail(400, { jobForm });
		}

		if (job_id !== null) {
			// Update the job
			const updatedJob = await db
				.update(Jobs)
				.set({
					Title: jobForm.data.title,
					Description: jobForm.data.description,
					MinRate: jobForm.data.min_rate,
					MaxRate: jobForm.data.max_rate,
					JobTypeId: jobForm.data.job_type,
					Draft: jobForm.data.draft,
					UserId: user.Id
				})
				.where(eq(Jobs.Id, job_id))
				.returning();

			throw redirect(303, '/dashboard/jobs/new?job_id=' + updatedJob[0].Id);
		}

		// Check if the job already exists
		const job = await db.select().from(Jobs).where(eq(Jobs.Title, jobForm.data.title));
		if (job.length > 0) {
			return setError(jobForm, 'title', 'A job with this name already exists');
		}

		// Create the job
		const newJob = await db
			.insert(Jobs)
			.values({
				Title: jobForm.data.title,
				Description: jobForm.data.description,
				MinRate: jobForm.data.min_rate,
				MaxRate: jobForm.data.max_rate,
				JobTypeId: jobForm.data.job_type,
				Draft: jobForm.data.draft,
				UserId: user.Id
			})
			.returning();

		if (!jobForm.data.draft) {
			if (jobForm.data.broadcast_job === 'on') {
				// Broadcast the job to all users
				broadcastEmail({
					bcc: true,
					subject: `${newJob[0].Title} job at ${user.FirstName + (user.LastName.trim() !== '' ? ' ' + user.LastName : '')} is available for applications`,
					body:
						`A new job has been posted: ${newJob[0].Title}\n\nYou can view it here:` +
						`\n\n${IS_DEVELOPMENT === 'true' ? PLATFORM_URL_DEVELOPMENT : PLATFORM_URL}/dashboard/jobs/view/${newJob[0].Id}` +
						`\n\nAll the best,\n${MAIL_SIGNATURE}`
				});
			}
			cookies.set('message_title', 'Job Published', { path: '/' });
			cookies.set('message_title2', newJob[0].Title, { path: '/' });
			cookies.set('message_description', 'Your listing has been published', {
				path: '/'
			});
			cookies.set(
				'message_description2',
				'This job has been marked visible to applicants, and they can now apply.',
				{
					path: '/'
				}
			);
			cookies.set('authenticated', 'true', { path: '/' });

			throw redirect(303, '/backend/message');
			// return jobForm;
		}
		throw redirect(303, '/dashboard/jobs/new?job_id=' + newJob[0].Id);
	},
	createQuestion: async (event) => {
		const formData = await event.request.formData();
		const form = Object.fromEntries(formData);
		const cookies = event.cookies;
		const job_id = cookies.get('job_id') ?? null;
		const session = cookies.get('session');

		// Check if the user is authenticated
		if (!session) throw redirect(301, '/auth/login');

		try {
			const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
			if (!jwt) throw redirect(301, '/auth/login');
		} catch {
			throw redirect(301, '/auth/login');
		}

		try {
			if (job_id === null) {
				const questionForm = await superValidate(formData, zod(questionSchema));
				setError(
					questionForm,
					'question_type',
					'First, save this job as a draft. You must create a job before adding questions'
				);
				return { questionForm };
			}

			questionSchema.parse(form);
			const questionForm = await superValidate(formData, zod(questionSchema));

			// Create the question
			const user = event.locals.user;
			if (!user) throw redirect(301, '/auth/login');

			// Do we own the job?
			const job = await db.select().from(Jobs).where(eq(Jobs.Id, job_id));
			if (job.length === 0 || job[0].UserId !== user.Id) {
				throw redirect(301, '/dashboard/');
			}

			await db.insert(Questions).values({
				Content: questionForm.data.question_content,
				Type: questionForm.data.question_type === 'true-false',
				Draft: false,
				JobsId: job_id
			});

			// Return all the questions for the job
			const questions = await db.select().from(Questions).where(eq(Questions.JobsId, job_id));
			message(questionForm, 'Your question has been created');
			return { questionForm, questions };
		} catch {
			const questionForm = await superValidate(formData, zod(questionSchema));
			setError(questionForm, 'question_type', 'Something went wrong, try again');
			return { questionForm };
		}
	},
	removeQuestion: async (event) => {
		const user = event.locals.user;

		if (user !== null && user !== undefined) {
			if (user.AccountType !== 'org' && user.AccountType !== 'owner') {
				throw error(403, 'Forbidden');
			}
		} else {
			throw redirect(301, '/auth/login');
		}

		const cookies = event.cookies;
		const session = cookies.get('session');
		if (!session) throw redirect(301, '/auth/login');

		try {
			Jwt.verify(session, JWT_SECRET);
		} catch {
			throw redirect(301, '/auth/login');
		}

		const job_id = cookies.get('job_id') ?? null;
		if (!job_id) throw redirect(301, '/dashboard/jobs/new');

		const formData = await event.request.formData();
		const questionForm = await superValidate(formData, zod(removeQuestionSchema));
		if (!questionForm.valid) return { questionForm };

		// Check if the user is authenticated
		if (!user) throw redirect(301, '/auth/login');

		// Do we own the job?
		const job = await db.select().from(Jobs).where(eq(Jobs.Id, job_id));
		if (job.length === 0 || job[0].UserId !== user.Id) {
			throw redirect(301, '/dashboard/');
		}

		const question = await db
			.select()
			.from(Questions)
			.where(eq(Questions.Id, questionForm.data.question_id));
		if (question.length === 0 || question[0].JobsId !== job_id) {
			console.log('Question not found');
			throw redirect(301, '/dashboard/jobs/new?job_id=' + job_id);
		}
		await db.delete(Questions).where(eq(Questions.Id, questionForm.data.question_id));
		const questions = await db.select().from(Questions).where(eq(Questions.JobsId, job_id));
		message(questionForm, 'Your question has been removed');
		return { questionForm, questions };
	}
};
