import { db } from '$lib/server/db';
import { Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
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
	cookies.delete('authenticated', { path: '/' });
	const user = event.locals.user;
	if (!user) throw redirect(301, '/auth/login');

    
	// Get total number of jobs
	const jobsLength = await db.$count(Jobs);

	// Get all jobs and populate
	const jobs = await db
		.select()
		.from(Jobs)
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.where(eq(Jobs.UserId, user.Id)) // Only get jobs owned by the current user
		.offset(offset) // Move forward by the offset
		.limit(10); // Stop after 10 jobs

	return { user, jobsLength, jobs, offset: page };
};
