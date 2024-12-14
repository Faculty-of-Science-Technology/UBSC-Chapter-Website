import { JWT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { Jobs, Questions, Users } from '$lib/server/db/schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Jwt from 'jsonwebtoken';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { getUser } from '$lib/functions/users';

const jobSchema = z.object({
	title: z
		.string({ required_error: 'You must define a job title' })
		.max(255, { message: 'Your job title is too long' }),
	description: z.string({ required_error: 'You must define a job description' }),
	min_rate: z.number().min(1),
	max_rate: z.number().min(2),
	job_type: z
		.number({ required_error: 'You must define a job type' })
		.min(1, { message: 'Invalid job type' })
		.max(3, { message: 'Invalid job type' }),
	draft: z.boolean({ required_error: 'Something happened on our end, try that one more time' })
	// userId: z.string().uuid() // Generated on submit by the server
});

const questionSchema = z.object({
	content: z
		.string({ required_error: "You can't create an empty question" })
		.max(255, { message: 'Your question is too long' }),
	type: z.boolean({ required_error: 'You must define a question type' })
	// draft: z.boolean() // Generated on submit by the server
});

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
			const super_form = await superValidate(formData, zod(jobSchema));
			const user = await getUser(Users.Email, jwt['email']);
			if (!user) throw redirect(301, '/auth/login');

			// Check if the job already exists
			const job = await db.select().from(Jobs).where(eq(Jobs.Title, super_form.data.title));
			if (job) {
				return setError(super_form, 'title', 'A job with this name already exists');
			}

			// Create the job
			const newJob = await db.insert(Jobs).values({
				Title: super_form.data.title,
				Description: super_form.data.description,
				MinRate: super_form.data.min_rate,
				MaxRate: super_form.data.max_rate,
				JobTypeId: super_form.data.job_type,
				Draft: super_form.data.draft,
				UserId: user.Id
			}).returning({ Id: Jobs.Id, Title: Jobs.Title });
console.log(newJob);
            if(!super_form.data.draft) {
			// return redirect(`/dashboard/jobs/${job.Id}`);
			cookies.set('message_title', 'Job Published', { path: '/' });
			cookies.set('message_title2', newJob.Title, { path: '/' });
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
			// return super_form;
        }
        throw redirect(303, '/dashboard/jobs/new?job');
		} catch {
			const super_form = await superValidate(formData, zod(jobSchema));
			return { super_form };
		}
	},
	createQuestion: async (event) => {
		const formData = await event.request.formData();
		const form = Object.fromEntries(formData);
		const cookies = event.cookies;
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
			questionSchema.parse(form);
			const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
			const super_form = await superValidate(formData, zod(questionSchema));

			// Create the question
			const user = await getUser(Users.Email, jwt['email']);
			if (!user) throw redirect(301, '/auth/login');

			const question = await db.insert(Questions).values({
				Content: super_form.data.content,
				Type: super_form.data.type,
				Draft: false
			});

			// return redirect(`/dashboard/jobs/${question.Id}`);
			return super_form;
		} catch (error) {
			return error;
		}
	}
};
