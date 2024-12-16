import { JWT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { Jobs, Questions, Users } from '$lib/server/db/schema';
import { isRedirect, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Jwt from 'jsonwebtoken';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { getUser } from '$lib/functions/users';
let job_id: string | null = null;

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
	})
	// userId: z.string().uuid() // Generated on submit by the server
});

const questionSchema = z.object({
	question_content: z
		.string({ required_error: "You can't create an empty question" })
		.min(1, { message: 'Your question is too short' })
		.max(255, { message: 'Your question is too long' }),
	question_type: z.enum(['true-false', 'short-answer'], {
		required_error: 'You must choose a question type'
	})
	// draft: z.boolean() // Generated on submit by the server
});

export const load = async (event) => {
	// Get page query parameters
	const { cookies, url } = event;
	const query = new URLSearchParams(url.search);
	job_id = query.get('job_id');
	console.log(job_id);

	if (job_id) {
		// Lookup the job
		const job = await db.select().from(Jobs).where(eq(Jobs.Id, job_id));
		// console.log(job);

		if (!job) return;
		const job_found = job[0];
		// Map the job to the form
		const mapped_job = {
			title: job_found.Title,
			description: job_found.Description,
			min_rate: job_found.MinRate,
			max_rate: job_found.MaxRate,
			job_type: job_found.JobTypeId ?? 1, // Default to 1 if null
			draft: job_found.Draft
		};

		const jobForm = await superValidate(mapped_job, zod(jobSchema));
		const questionForm = await superValidate(zod(questionSchema));
		// console.log(super_form);
		return { jobForm, questionForm };
	}
};

export const actions: Actions = {
	createJob: async (event) => {
		const formData = await event.request.formData();
		const cookies = event.cookies;
		const session = cookies.get('session');
		const form = Object.fromEntries(formData);
		console.log(form);
		// Check if the user is authenticated
		if (!session) throw redirect(301, '/auth/login');

		try {
			const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
			if (!jwt) throw redirect(301, '/auth/login');
		} catch {
			throw redirect(301, '/auth/login');
		}

		try {
			jobSchema.parse(form);
			const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
			const jobForm = await superValidate(formData, zod(jobSchema));
			const user = await getUser(Users.Email, jwt['email']);
			if (!user) throw redirect(301, '/auth/login');

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
					.returning({ Id: Jobs.Id });
				console.log('Updating job...');
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
				.returning({ Id: Jobs.Id, Title: Jobs.Title });
			console.log(newJob);
			if (!jobForm.data.draft) {
				// return redirect(`/dashboard/jobs/${job.Id}`);
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
		} catch (e) {
			if (isRedirect(e)) {
				throw e;
			}
			const jobForm = await superValidate(formData, zod(jobSchema));
			return { jobForm };
		}
	},
	createQuestion: async (event) => {
		const formData = await event.request.formData();
		const form = Object.fromEntries(formData);
		const cookies = event.cookies;
		const session = cookies.get('session');
		// console.log(form);
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
				const questionForm = await superValidate(formData, zod(jobSchema));
				setError(
					questionForm,
					'title',
					'First, save this as a draft. You must create a job before adding questions'
				);
				return { questionForm };
			}

			questionSchema.parse(form);
			const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
			const questionForm = await superValidate(formData, zod(questionSchema));

			// Create the question
			const user = await getUser(Users.Email, jwt['email']);
			if (!user) throw redirect(301, '/auth/login');

			const question = await db.insert(Questions).values({
				Content: questionForm.data.question_content,
				Type: questionForm.data.question_type === 'true-false' ? 1 : 0,
				Draft: false
			});

			// return redirect(`/dashboard/jobs/${question.Id}`);
			// const questionForm_job = await superValidate(formData, zod(jobSchema));
			// return questionForm_job;
			return { questionForm };
		} catch {
			const questionForm = await superValidate(formData, zod(questionSchema));
			return { questionForm };
		}
	}
};
