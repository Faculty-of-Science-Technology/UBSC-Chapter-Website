import { db } from '$lib/server/db';
import {
    JobApplications,
    JobQuestionResponses,
    Jobs,
    JobTypes,
    Questions,
    Users
} from '$lib/server/db/schema';
import { isRedirect, redirect, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const JobApplicationSchema = z.object({
	first_name: z
		.string({ required_error: "Looks like your first name isn't set. Go change it in settings" })
		.min(2, {
			message:
				'There was an error processing your details. You need to go re-enter your first name in settings.'
		})
		.max(255, { message: 'Your first name is unfortunately too long' }),
	last_name: z
		.string({ required_error: "Looks like your last name isn't set. Go change it in settings" })
		.min(2, {
			message:
				'There was an error processing your details. You need to go re-enter your last name in settings.'
		})
		.max(255, { message: 'Your last name is unfortunately too long' }),
	phone: z
		.string({ required_error: 'Please enter a valid phone number' })
		.min(7, { message: 'Check your phone number for errors' })
		.max(15, { message: 'Enter a valid phone number' })
		.regex(/^\+[1-9]\d{3,14}$/),
	email: z
		.string({ required_error: 'Please enter a valid email address.' })
		.email({ message: 'Please enter a valid email address.' }),
	resume: z.string({ required_error: 'Your resume is required' }),
	notice_period: z.coerce
		.number({ required_error: 'Enter a notice period between 1 and 90' })
		.min(1, { message: "You can't start right away. Enter a longer notice period." })
		.max(180, {
			message:
				"Hey, that's way too long. Enter a reasonable notice period preferably less than 90 days but no longer than 180 days."
		}),
	draft: z.boolean({ required_error: 'Something happened on our end, try that one more time' }),
	question_response_array: z.array(
		z.object({
			question_id: z.number({
				required_error: 'Something happened on our end, try that again one more time'
			}),
			response: z
				.string({ required_error: 'You need to answer this question' })
				.trim()
				.min(2, { message: 'Your answer is too short or completely missing' })
				.max(512, { message: 'Your answer is too long for this question' })
		})
	)
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
		const { cookies } = event;
		const job_id = cookies.get('job_id');
		// const form = Object.fromEntries(formData);

		// Check if the user is authenticated
		const user = event.locals.user;
		if (!user || !job_id) throw redirect(301, '/auth/login');
		const applicationForm = await superValidate(formData, zod(JobApplicationSchema));
		console.log(applicationForm.data);
		try {
			JobApplicationSchema.parse(applicationForm.data);

			// First and foremost, let's check if the job exists
			const job = await db
				.select()
				.from(Jobs)
				.where(eq(Jobs.Id, job_id))
				.limit(1)
				.then((res) => res[0]);

			if (!job) {
				setError(
					applicationForm,
					'draft',
					'The job you are applying for has just been deleted or never existed'
				);
				return { applicationForm };
			}

			// Check if the user has already applied for the job
			const jobApplication = await db
				.select()
				.from(JobApplications)
				.where(and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, user.Id)))
				.limit(1)
				.then((res) => res[0]);

			if (jobApplication) {
				setError(
					applicationForm,
					'draft',
					'You have already applied for this job. You can only apply once'
				);
				return { applicationForm };
			}

			// Check if the user has answered all the questions
			const questions = await db
				.select()
				.from(Questions)
				.where(and(eq(Questions.JobsId, job_id), eq(Questions.Draft, false)));

			if (questions.length !== applicationForm.data.question_response_array.length) {
				setError(applicationForm, 'draft', 'You need to answer all the questions');
				return { applicationForm };
			}

			// Save the application
			const jobApplicationId = await db
				.insert(JobApplications)
				.values({
					UserId: user.Id,
					JobsId: job_id,
					FirstName: applicationForm.data.first_name,
					LastName: applicationForm.data.last_name,
					PhoneNumber: applicationForm.data.phone,
					EmailAddress: applicationForm.data.email,
					ResumeUrl: applicationForm.data.resume,
					NoticePeriod: applicationForm.data.notice_period,
					Draft: applicationForm.data.draft,
					Status: 'pending'
				})
				.returning({ Id: JobApplications.Id });

			// Save the question responses
			for (const response of applicationForm.data.question_response_array) {
				await db.insert(JobQuestionResponses).values({
					JobApplicationId: jobApplicationId[0].Id,
					QuestionsId: response.question_id,
					Content: response.response
				});
			}

			// Redirect to the backend message page
			cookies.set('message_title', 'Application Submitted', { path: '/' });
			cookies.set('message_title2', job.Title, { path: '/' });
			cookies.set('message_description', 'Response recorded.', { path: '/' });
			cookies.set(
				'message_description2',
				'Thank you for applying. We will notify you via email once the employer reviews your application and decides on the next steps.',
				{ path: '/' }
			);
			cookies.set('authenticated', 'true', { path: '/' });

			throw redirect(303, '/backend/message');
		} catch (e) {
			if (isRedirect(e)) {
				throw e;
			}
			const applicationForm = await superValidate(formData, zod(JobApplicationSchema));
			setError(
				applicationForm,
				'draft',
				'Something happened on our end. Try checking over your response and trying to submit again once more'
			);
			return { applicationForm };
		}
	}
};
