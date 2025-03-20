import { db } from '$lib/server/db';
import { JobApplications, Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const cookies = event.cookies;
	const url = event.url;
	const query = url.searchParams;
	// Try to coerce the page query parameter to a number
	let page = parseInt(query.get('page') ?? '');
	// Check to ensure the page query parameter is a number
	if (isNaN(page)) {
		page = 1;
	}
	if (page < 1) {
		page = 1;
	}
	const offset = page ? (page - 1) * 10 : 0; // Offset is 0 if page is 1, otherwise it's 10 * (page - 1)
	// ...since we're showing 10 jobs per page

	cookies.delete('message_title', { path: '/' });
	cookies.delete('message_title2', { path: '/' });

	cookies.delete('message_description', {
		path: '/'
	});
	cookies.delete('message_description2', {
		path: '/'
	});
	
	const user = event.locals.user;
	if (!user) {
		throw redirect(301, '/auth/login');
	}
	// Get all jobs
	const jobs = await db // { Jobs: object, JobTypes: object, Users: object }
		.select()
		.from(Jobs)
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.where(or(eq(Jobs.Draft, false), eq(Jobs.UserId, user.Id))) // Only show published jobs
		.offset(offset) // Move forward by the offset
		.limit(10); // Stop after 10 jobs

	// The total number of jobs stored in the database
	const jobsLength = await db.$count(Jobs, or(eq(Jobs.Draft, false), eq(Jobs.UserId, user.Id)));

	// Get all submitted applications and populate
	const jobApplications = await db
		.select()
		.from(JobApplications)
		.leftJoin(Jobs, eq(JobApplications.JobsId, Jobs.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.where(eq(JobApplications.UserId, user.Id))
		.limit(1);

	return { user, jobs, jobsLength, jobApplications, offset: page };
};
