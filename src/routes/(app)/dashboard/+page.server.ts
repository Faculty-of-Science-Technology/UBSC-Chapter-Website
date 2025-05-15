import { db } from '$lib/server/db';
import { JobApplications, Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { and, desc, eq, or } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const cookies = event.cookies;
	const url = event.url;
	const query = url.searchParams;

	// Define items per page constant
	const ITEMS_PER_PAGE = 10;

	// Parse and validate page parameter
	let page = parseInt(query.get('page') ?? '1');
	if (isNaN(page) || page < 1) {
		page = 1;
	}

	// Calculate offset based on page number
	const offset = (page - 1) * ITEMS_PER_PAGE;

	cookies.delete('message_title', { path: '/' });
	cookies.delete('message_title2', { path: '/' });
	cookies.delete('message_description', { path: '/' });
	cookies.delete('message_description2', { path: '/' });

	const user = event.locals.user;
	if (!user) {
		throw redirect(301, '/auth/login');
	}

	// Filter condition for jobs
	const jobsFilter = and(
		or(eq(Jobs.Draft, false), eq(Jobs.UserId, user.Id)),
		eq(Jobs.Draft, false),
		eq(Jobs.Deleted, false)
	);

	// Get all jobs for current page with proper ordering to ensure consistent pagination
	const jobs = await db
		.select()
		.from(Jobs)
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.where(jobsFilter)
		.orderBy(desc(Jobs.CreatedAt)) // Reversed order for newest first
		.offset(offset)
		.limit(ITEMS_PER_PAGE);

	// Get total job count
	const jobsLength = await db.$count(Jobs, jobsFilter);

	// Calculate total pages
	const totalPages = Math.max(1, Math.ceil(jobsLength / ITEMS_PER_PAGE));

	// Ensure page number doesn't exceed total pages
	if (page > totalPages) {
		page = totalPages;
	}

	// Get all submitted applications and populate
	const jobApplications = await db
		.select()
		.from(JobApplications)
		.leftJoin(Jobs, eq(JobApplications.JobsId, Jobs.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.where(eq(JobApplications.UserId, user.Id))
		.limit(1);

	return {
		user,
		jobs,
		jobsLength,
		jobApplications,
		pagination: {
			currentPage: page,
			totalPages: totalPages,
			itemsPerPage: ITEMS_PER_PAGE
		}
	};
};
