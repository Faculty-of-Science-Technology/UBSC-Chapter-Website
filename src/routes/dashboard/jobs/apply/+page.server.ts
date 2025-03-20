import {
	IS_DEVELOPMENT,
	MAIL_DISPLAYNAME,
	MAIL_PASSWORD,
	MAIL_SIGNATURE,
	MAIL_USERNAME,
	PLATFORM_NAME,
	PLATFORM_URL,
	PLATFORM_URL_DEVELOPMENT
} from '$env/static/private';
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
import nodemailer from 'nodemailer';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

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
	resume: z
		.instanceof(File, { message: 'Your resume is required' })
		.refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.'),
	notice_period: z.coerce
		.number({ required_error: 'Enter a notice period between 1 and 90' })
		.min(1, { message: "You can't start right away. Enter a longer notice period." })
		.max(180, {
			message:
				"That's too long. Enter a reasonable notice period preferably less than 90 days but no longer than 180 days."
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

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) throw redirect(301, '/auth/login');

	// Get page query parameters
	const { cookies, url } = event;
	cookies.delete('job_id', { path: '/' });
	const query = new URLSearchParams(url.search);
	const user = event.locals.user;
	const job_id = query.get('job_id');
	const application_id = query.get('application_id');

	if (job_id) {
		// Set the cookie
		cookies.set('job_id', job_id, { path: '/' });
		// Lookup the job
		const job = await db // { Jobs: object, JobTypes: object, Users: object }
			.select()
			.from(Jobs)
			.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
			.leftJoin(Users, eq(Jobs.UserId, Users.Id))
			.where(eq(Jobs.Id, job_id))
			.limit(1)
			.then((res) => res[0]); // Turn the array into an object
		if (!job) throw redirect(301, '/dashboard/'); // Redirect if the job doesn't exist
		if (job.Jobs.Draft) throw redirect(301, '/dashboard/'); // Redirect if the job is a draft

		// Lookup the questions
		const questions = await db
			.select()
			.from(Questions)
			.where(and(eq(Questions.JobsId, job.Jobs.Id), eq(Questions.Draft, false)));

		// Lookup the application
		const jobForm = await db
			.select()
			.from(JobApplications)
			.leftJoin(Jobs, eq(JobApplications.JobsId, Jobs.Id))
			.where(
				and(
					eq(JobApplications.JobsId, job_id),
					application_id
						? and(
								eq(JobApplications.Id, application_id),
								eq(Jobs.UserId, user.Id),
								eq(JobApplications.Draft, false)
							) // Get the job application form whereby the user is the owner of the job
						: eq(JobApplications.UserId, event.locals.user.Id) // Get the job application form owned by the user whereby the application_id is not set
				)
			); // Get the job application form owned by the user

		if (!jobForm || jobForm.length === 0) {
			// Return an empty application form
			const applicationForm = await superValidate(zod(JobApplicationSchema));
			applicationForm.data.draft = true;
			return { applicationForm, job, questions, user };
		}
		const application_found = jobForm[0];

		// Return all the questions for the job
		const questionResponse = await db
			.select()
			.from(JobQuestionResponses)
			.where(eq(JobQuestionResponses.JobApplicationId, application_found.JobApplications.Id));

		const question_response_array = questionResponse.map((question) => ({
			question_id: question.QuestionsId ?? 0, // Ensure question_id is a number
			response: question.Content
		}));

		// Map the job to the form
		const mapped_application = {
			first_name: application_found.JobApplications.FirstName,
			last_name: application_found.JobApplications.LastName,
			phone: application_found.JobApplications.PhoneNumber,
			email: application_found.JobApplications.EmailAddress,
			resume: null,
			notice_period: application_found.JobApplications.NoticePeriod,
			draft: application_found.JobApplications.Draft,
			question_response_array: question_response_array
		};

		// Return the application form
		// @ts-expect-error - We can't manually assign a file to a form field
		const applicationForm = await superValidate(mapped_application, zod(JobApplicationSchema));
		// Change the error message from the resume field to make it more applicable.
		if (
			applicationForm.data.draft === true &&
			application_found.JobApplications.Status === 'pending'
		) {
			applicationForm.errors.resume = ['For security reasons, you need to re-upload your resume.'];
		} else if (
			applicationForm.data.draft === false &&
			application_found.JobApplications.Status === 'pending'
		) {
			applicationForm.errors.resume = undefined;
		}
		return {
			applicationForm,
			job,
			questions,
			user,
			applicationId: application_found.JobApplications.Id,
			applicationStatus: application_found.JobApplications.Status
		};
	}
	throw redirect(301, '/dashboard/');
};

export const actions: Actions = {
	createApplication: async (event) => {
		const formData = await event.request.formData();
		const { cookies } = event;
		const job_id = cookies.get('job_id');

		// Check if the user is authenticated
		const user = event.locals.user;
		if (user === undefined || job_id === undefined) throw redirect(301, '/auth/login');
		const applicationForm = await superValidate(formData, zod(JobApplicationSchema));
		try {
			JobApplicationSchema.parse(applicationForm.data);

			// First and foremost, let's check if the job exists
			const job = await getJob(job_id);
			if (!job) {
				setError(
					applicationForm,
					'draft',
					'The job you are applying for has just been deleted or never existed'
				);
				return { applicationForm };
			}

			// Check if the user has already applied for the job
			const jobApplication = await getJobApplication(job_id, user.Id);
			if (jobApplication && !jobApplication.Draft) {
				setError(
					applicationForm,
					'draft',
					'You have already applied for this job. You can only apply once'
				);
				return { applicationForm };
			}

			// Create a new job application
			if (!jobApplication) {
				// Check if the user has answered all the questions
				const questions = await db
					.select()
					.from(Questions)
					.where(and(eq(Questions.JobsId, job_id), eq(Questions.Draft, false)));

				if (questions.length !== applicationForm.data.question_response_array.length) {
					setError(applicationForm, 'draft', 'You need to answer all the questions');
					return { applicationForm };
				}

				// console.log('SUBMIT:', applicationForm.data.question_response_array);
				const return_success = await createApplication({
					first_name: applicationForm.data.first_name,
					last_name: applicationForm.data.last_name,
					phone: applicationForm.data.phone,
					email: applicationForm.data.email,
					resume: applicationForm.data.resume,
					notice_period: applicationForm.data.notice_period,
					draft: applicationForm.data.draft,
					question_response_array: applicationForm.data.question_response_array,
					job_id,
					userId: user.Id
				});
				if (!return_success) {
					setError(
						applicationForm,
						'draft',
						'Something happened on our end. Try checking over your response and trying to submit again once more'
					);
					return { applicationForm };
				}
			}

			// Do we own the job application?
			if (jobApplication && jobApplication.UserId !== user.Id) {
				setError(
					applicationForm,
					'draft',
					'You can only apply or update jobs you own. This job application belongs to someone else'
				);
				return { applicationForm };
			}

			// Update the job application if it's a draft
			if (jobApplication?.Draft) {
				// Show a message if the application is a draft
				// console.log('DRAFT_SUBMIT: ');
				const returned_success = await updateJobApplication({
					first_name: applicationForm.data.first_name,
					last_name: applicationForm.data.last_name,
					phone: applicationForm.data.phone,
					email: applicationForm.data.email,
					resume: applicationForm.data.resume,
					notice_period: applicationForm.data.notice_period,
					draft: applicationForm.data.draft,
					question_response_array: applicationForm.data.question_response_array,
					job_id: jobApplication.Id
				});
				if (!returned_success) {
					setError(
						applicationForm,
						'draft',
						'Something happened on our end. Try checking over your response and trying to submit again once more'
					);
					return { applicationForm };
				}
			}

			if (applicationForm.data.draft) {
				setDraftMessages(cookies, job.Title as unknown as string);
				throw redirect(303, '/backend/message');
			}

			setSubmitMessages(cookies, job.Title as unknown as string, job);
			throw redirect(303, '/backend/message');
		} catch (e) {
			if (isRedirect(e)) {
				throw e;
			}
			// console.log(e);
			const applicationForm = await superValidate(formData, zod(JobApplicationSchema));
			applicationForm.data.draft = true;
			setError(
				applicationForm,
				'draft',
				'Something happened on our end. Try checking over your response and trying to submit again once more'
			);
			return { applicationForm };
		}
	}
};

const getJob = async (job_id: string): Promise<typeof Jobs | undefined> => {
	return (await db
		.select()
		.from(Jobs)
		.where(eq(Jobs.Id, job_id))
		.limit(1)
		.then((res) => res[0])) as typeof Jobs | undefined;
};

const getJobApplication = async (job_id: string, user_id: string) => {
	return await db
		.select()
		.from(JobApplications)
		.where(and(eq(JobApplications.JobsId, job_id), eq(JobApplications.UserId, user_id)))
		.limit(1)
		.then((res) => res[0]);
};

interface QuestionResponse {
	question_id: number;
	response: string;
}

interface Cookies {
	set(name: string, value: string, options?: { path: string }): void;
}

const setDraftMessages = (cookies: Cookies, jobTitle: string): void => {
	cookies.set('message_title', 'Application Drafted', { path: '/' });
	cookies.set('message_title2', jobTitle, { path: '/' });
	cookies.set('message_description', 'Your application has been saved as a draft', {
		path: '/'
	});
	cookies.set(
		'message_description2',
		'You can continue editing your application and submit it later',
		{ path: '/' }
	);
	cookies.set('authenticated', 'true', { path: '/' });
};

const setSubmitMessages = (cookies: Cookies, jobTitle: string, job: typeof Jobs): void => {
	// Redirect to the backend message page
	cookies.set('message_title', 'Application Submitted', { path: '/' });
	cookies.set('message_title2', jobTitle, { path: '/' });
	cookies.set('message_description', 'Response recorded.', { path: '/' });
	cookies.set(
		'message_description2',
		'Thank you for applying. We will notify you via email once the employer reviews your application and decides on the next steps.',
		{ path: '/' }
	);
	cookies.set('authenticated', 'true', { path: '/' });

	// Find the employer's email
	db.select()
		.from(Users)
		.where(eq(Users.Id, job.UserId))
		.limit(1)
		.then((res) => {
			if (res.length === 0) return;
			const employer = res[0];
			sendNotificationEmail(employer, job);
		});
};

const sendNotificationEmail = async (
	employer: {
		Id: string;
		CreatedAt: string;
		AccountType: 'host' | 'student' | 'owner';
		Administrator: boolean;
		FirstName: string;
		LastName: string;
		Email: string;
		Password: string;
		ActivationCode: string | null;
		Bio: string | null;
		Hireable: boolean;
	},
	job: typeof Jobs
): Promise<void> => {
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

	transporter.sendMail({
		from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
		to: employer.Email,
		subject: `Someone has applied for your '${job.Title}' job on ${PLATFORM_NAME}`,
		text: `Hey,\n\nSomeone has applied for your job posting '${job.Title}' on ${PLATFORM_NAME}. You can view the application in the dashboard here:\n\n${Boolean(IS_DEVELOPMENT) ? PLATFORM_URL_DEVELOPMENT : PLATFORM_URL}/dashboard/jobs/applicants?job_id=${job.Id}\n\nAll the best,\n${MAIL_SIGNATURE}`
	});
};

const getResumeDataUri = async (mimetype: string, resume: File): Promise<string | undefined> => {
	// Prepare the file
	const arrayBuff = await resume.arrayBuffer();
	// https://medium.com/@wahidsaeed1/encoded-decoding-data-url-with-buffer-api-nodejs-41a28f435a1e
	const resume_data_uri: string = resume
		? `data:${mimetype};base64,` + Buffer.from(arrayBuff).toString('base64')
		: ''; // Maybe one day UB pays for blob storage :/
	return resume_data_uri;
};

const updateJobApplication = async ({
	first_name,
	last_name,
	phone,
	email,
	resume,
	notice_period,
	draft,
	question_response_array,
	job_id
}: {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	resume: File;
	notice_period: number;
	draft: boolean;
	question_response_array: QuestionResponse[];
	job_id: string;
}): Promise<boolean> => {
	const upload_mimetype = resume.type;
	const resume_data_uri = await getResumeDataUri(upload_mimetype, resume);
	if (!resume_data_uri) {
		return false;
	}

	// console.log('ENTRY_TO:UPDATE:', question_response_array);
	await db
		.update(JobApplications)
		.set({
			FirstName: first_name,
			LastName: last_name,
			PhoneNumber: phone,
			EmailAddress: email,
			ResumeUrl: resume ? resume_data_uri.toString() : '',
			NoticePeriod: notice_period,
			Draft: draft,
			Status: 'pending'
		})
		.where(eq(JobApplications.Id, job_id));

	// Update the question responses
	for (const response of question_response_array) {
		// console.log('CREATE_OR_UPDATE_QUESTION_RESPONSE: ', JSON.stringify(response));
		// Search for the question response
		const questionResponse = await db
			.select()
			.from(JobQuestionResponses)
			.where(
				and(
					eq(JobQuestionResponses.JobApplicationId, job_id),
					eq(JobQuestionResponses.QuestionsId, response.question_id)
				)
			);

		if (questionResponse.length === 0) {
			// Insert the question response if it doesn't exist
			await db.insert(JobQuestionResponses).values({
				JobApplicationId: job_id,
				QuestionsId: response.question_id,
				Content: response.response
			});
		} else {
			// Update the question response if it already exists
			await db
				.update(JobQuestionResponses)
				.set({
					Content: response.response
				})
				.where(
					and(
						eq(JobQuestionResponses.JobApplicationId, job_id),
						eq(JobQuestionResponses.QuestionsId, response.question_id)
					)
				);
		}
	}

	return true;
};

const createApplication = async ({
	first_name,
	last_name,
	phone,
	email,
	resume,
	notice_period,
	draft,
	question_response_array,
	job_id,
	userId
}: {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	resume: File;
	notice_period: number;
	draft: boolean;
	question_response_array: QuestionResponse[];
	job_id: string;
	userId: string;
}): Promise<boolean> => {
	const upload_mimetype = resume.type;
	const resume_data_uri = await getResumeDataUri(upload_mimetype, resume);
	if (!resume_data_uri) {
		return false;
	}

	// Save the application
	const jobApplicationId = await db
		.insert(JobApplications)
		.values({
			UserId: userId,
			JobsId: job_id,
			FirstName: first_name,
			LastName: last_name,
			PhoneNumber: phone,
			EmailAddress: email,
			ResumeUrl: resume_data_uri,
			NoticePeriod: notice_period,
			Draft: draft,
			Status: 'pending'
		})
		.returning({ Id: JobApplications.Id });

	// Save the question responses
	for (const response of question_response_array) {
		// console.log('CREATE_QUESTION_RESPONSE: ', JSON.stringify(response));
		await db.insert(JobQuestionResponses).values({
			JobApplicationId: jobApplicationId[0].Id,
			QuestionsId: response.question_id,
			Content: response.response
		});
	}
	return true;
};
