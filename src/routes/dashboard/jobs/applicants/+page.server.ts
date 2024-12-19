import { db } from '$lib/server/db';
import { JobApplications, Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { and, count, eq } from 'drizzle-orm';

export const load = async (event) => {
	const url = event.url;
	const query = url.searchParams;
	// Try to coerce the page query parameter to a number
	// const cookies = event.cookies;
	let page = parseInt(query.get('page') ?? '');
	const job_id = query.get('job_id');
	const user = event.locals.user;
	if (!user) throw redirect(301, '/auth/login');
	// Check to ensure the page query parameter is a number

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

		return { user, dataLength, jobApplications: undefined, jobs, job: undefined, offset: page };
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

	return { user, dataLength, jobApplications, jobs: undefined, job, offset: page };
};
