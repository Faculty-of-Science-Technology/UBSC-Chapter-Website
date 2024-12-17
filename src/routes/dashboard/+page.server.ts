import { db } from '$lib/server/db';
import { Jobs, JobTypes, Users } from '$lib/server/db/schema.js';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	const cookies = event.cookies;
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
	if (!user) {
		throw redirect(301, '/auth/login');
	}
	// Get all jobs
	const jobs = await db // { Jobs: object, JobTypes: object, Users: object }
		.select()
		.from(Jobs)
		.leftJoin(JobTypes, eq(Jobs.JobTypeId, JobTypes.Id))
		.leftJoin(Users, eq(Jobs.UserId, Users.Id))
		.where(eq(Jobs.Draft, false)) // Only show published jobs
		.limit(10);

	return { user, jobs };
};
