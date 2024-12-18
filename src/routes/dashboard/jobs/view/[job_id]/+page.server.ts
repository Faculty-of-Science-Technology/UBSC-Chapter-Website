import { db } from '$lib/server/db';
import { Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const { url } = event;

	const resourceId = url.pathname.split('/').pop();
	if (!resourceId) throw redirect(301, '/dashboard/');

	const user = event.locals.user;
	if (!user) throw redirect(301, '/auth/login');

	// Get all jobs
	const job = await db // { Jobs: object, JobTypes: object, Users: object }
		.select()
		.from(Jobs)
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.where(eq(Jobs.Id, resourceId)) // Only show published jobs or jobs owned by the user
		.limit(1)
		.then((res) => res[0]); // Turn the array into an object
	if (job.Jobs.Draft) throw redirect(301, '/dashboard/'); // Redirect if the job is a draft
	return { user, job };
};
