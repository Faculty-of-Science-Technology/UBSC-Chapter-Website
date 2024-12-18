import { db } from '$lib/server/db';
import {
    JobApplications,
    JobQuestionResponses,
    Jobs,
    JobTypes,
    Questions,
    Users
} from '$lib/server/db/schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const JobApplicationSchema = z.object({
	first_name: z.string().min(1).max(255),
	last_name: z.string().min(1).max(255),
	phone: z
		.string()
		.min(7)
		.max(15)
		.regex(/^\+[1-9]\d{3,14}$/),
	email: z.string().email(),
	resume: z.string(),
	notice_period: z.coerce.number().min(1).max(90),
	question_response_array: z.array(
		z.object({ question_id: z.number(), response: z.string().min(1).max(512) })
	)
	// short_answer: z.string().min(1).max(512)
});

export const load = async (event) => {
	if (!event.locals.user) throw redirect(301, '/auth/login');

	// Get page query parameters
	const { cookies, url } = event;
	cookies.delete('job_id', { path: '/' });
	const query = new URLSearchParams(url.search);
	const user = event.locals.user;
	const job_id = query.get('job_id');
	console.log(job_id);
	if (job_id) {
		// Set the cookie
		cookies.set('job_id', job_id, { path: '/' });
		// Lookup the job
		const job = await db // { Jobs: object, JobTypes: object, Users: object }
			.select()
			.from(Jobs)
			.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
			.leftJoin(Users, eq(Jobs.UserId, Users.Id))
			.where(eq(Jobs.Id, job_id)) // Only show published jobs or jobs owned by the user
			.limit(1)
			.then((res) => res[0]); // Turn the array into an object
		if (!job) throw redirect(301, '/dashboard/');

		// Lookup the questions
		const questions = await db
			.select()
			.from(Questions)
			.where(and(eq(Questions.JobsId, job.Jobs.Id), eq(Questions.Draft, false)));

		// Lookup the application
		const jobForm = await db
			.select()
			.from(JobApplications)
			.where(
				and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, event.locals.user.Id))
			); // Get the job application form owned by the user

		if (!jobForm || jobForm.length === 0) {
			// Return an empty application form
			const applicationForm = await superValidate(zod(JobApplicationSchema));
			return { applicationForm, job, questions, user };
		}
		const application_found = jobForm[0];

		// Return all the questions for the job
		const questionResponse = await db
			.select()
			.from(JobQuestionResponses)
			.where(eq(JobQuestionResponses.JobApplicationId, JobApplications.Id));

		const question_response_array = questionResponse.map((question) => ({
			question_id: question.Id,
			response: question.Content
		}));

		// Map the job to the form
		const mapped_application = {
			first_name: application_found.FirstName,
			last_name: application_found.LastName,
			phone: application_found.PhoneNumber,
			email: application_found.EmailAddress,
			resume: application_found.ResumeUrl,
			notice_period: application_found.NoticePeriod,
			draft: application_found.Draft,
			question_response_array: question_response_array
		};

		console.log(mapped_application);

		// Return the application form
		const applicationForm = await superValidate(mapped_application, zod(JobApplicationSchema));
		return { applicationForm, job, questions, user };
	}
	throw redirect(301, '/dashboard/');
};

export const actions: Actions = {
	createApplication: async (event) => {
		const formData = await event.request.formData();
		//const { cookies } = event;
		//const session = cookies.get('session');
		const form = Object.fromEntries(formData);

		// Check if the user is authenticated
		const user = event.locals.user;
		if (!user) throw redirect(301, '/auth/login');
		const applicationForm = await superValidate(formData, zod(JobApplicationSchema));
		console.log(applicationForm.data);
	}
};
