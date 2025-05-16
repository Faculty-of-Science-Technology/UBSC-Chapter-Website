import { db } from '$lib/server/db';
import { JobApplications, Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect, type ServerLoad } from '@sveltejs/kit';
import { and, count, eq, inArray } from 'drizzle-orm';

export const load: ServerLoad = async (event) => {
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

	// Get total number of jobs owned by the user
	const jobsLength = await db
		.select({ count: count() })
		.from(Jobs)
		.where(and(eq(Jobs.UserId, user.Id), eq(Jobs.Deleted, false))) // Only get jobs owned by the current user and not deleted
		.then((res) => res[0].count);

	// Get all jobs and populate
	const jobs = await db
		.select()
		.from(Jobs)
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.where(and(eq(Jobs.UserId, user.Id), eq(Jobs.Deleted, false))) // Only get jobs owned by the current user and not deleted
		.offset(offset) // Move forward by the offset
		.limit(10); // Stop after 10 jobs

	const jobApplications = await db
		.select()
		.from(JobApplications)
		.where(
			inArray(
				JobApplications.JobsId,
				jobs.map((job) => job.Jobs.Id)
			)
		)
		.orderBy(JobApplications.JobsId)
		.limit(100) // Adjust the limit as needed
		.then((apps) => {
			const grouped = {};
			apps.forEach((app) => {
				if (!grouped[app.JobsId!]) {
					grouped[app.JobsId!] = [];
				}
				grouped[app.JobsId!].push(app);
			});
			return grouped;
		});
	return { user, jobsLength, jobs, jobApplications, offset: page };
};

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const user = locals.user;
		if (!user) throw redirect(301, '/auth/login');
		const formData = await request.formData();
		const jobId = formData.get('jobId');
		if (typeof jobId !== 'string') {
			throw redirect(301, '/dashboard/jobs');
		}

		// Check if the job exists and is owned by the user
		await db
			.update(Jobs)
			.set({
				Deleted: true
			})
			.where(and(eq(Jobs.Id, jobId), eq(Jobs.UserId, user.Id)))

			.then(() => {
				cookies.set('message_title', 'Job Deleted', { path: '/' });
				cookies.set('message_description', 'Job deleted successfully.', { path: '/' });
				cookies.set('message_title2', 'What Next?', { path: '/' });
				cookies.set(
					'message_description2',
					'You can create a new job or manage your existing ones.',
					{ path: '/' }
				);
				cookies.set('message_button_path', 'dashboard/jobs', { path: '/' });
				cookies.set('message_button', 'Manage Jobs', { path: '/' });
				cookies.set('authenticated', 'true', { path: '/' });
			});
		throw redirect(301, '/backend/message');
	}
};
