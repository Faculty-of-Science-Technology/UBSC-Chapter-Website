import { db } from '$lib/server/db';
import { JobApplications, JobQuestionResponses } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const JobApplicationSchema = z.object({
	first_name: z.string().min(1).max(255),
	last_name: z.string().min(1).max(255),
	phone: z.string().min(7).max(15),
	email: z.string().email(),
	resume: z.string(),
	notice_period: z.coerce.number().min(1).max(90),
	question_response_array: z.array(
		z.object({ question_id: z.string(), response: z.string().min(1).max(512) })
	)
	// short_answer: z.string().min(1).max(512)
});

export const load = async (event) => {
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
		const jobForm = await db
			.select()
			.from(JobApplications)
			.where(eq(JobApplications.JobsId, job_id));

		if (!jobForm) return;
		const application_found = jobForm[0];

		// Check if the user is the owner of the job
		if (application_found.UserId !== event.locals.user.Id) throw redirect(301, '/dashboard/');

		// Return all the questions for the job
		const questionResponse = await db
			.select()
			.from(JobQuestionResponses)
			.where(eq(JobQuestionResponses.JobApplicationId, JobApplications.Id));

		const question_response_array = questionResponse.map((question) => ({
			question_id: question.Id.toString(),
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

		// Return the application form
		const applicationForm = await superValidate(mapped_application, zod(JobApplicationSchema));

		return { applicationForm };
	}
	const applicationForm = await superValidate(zod(JobApplicationSchema));
	return { applicationForm };
};
