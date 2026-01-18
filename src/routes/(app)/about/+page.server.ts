import { db } from '$lib/server/db';
import { and, eq, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get leadership team members (you may need to adjust this query based on your role/permission system)
	const leadership = await db.query.Users.findMany({
		where: (users) =>
			and(
				eq(users.Administrator, true),
				isNull(users.ActivationCode),
				eq(users.Hidden, false)
			),
		columns: {
			Id: true,
			FirstName: true,
			LastName: true,
			Bio: true,
			ProfilePicture: true,
			Email: true
		},
		limit: 12 // Limit to 12 leadership members
	});

	// Transform the data to match our component expectations
	const leadershipData = leadership.map((leader) => ({
		id: leader.Id,
		firstName: leader.FirstName,
		lastName: leader.LastName,
		bio: leader.Bio,
		profilePicture: leader.ProfilePicture,
		role: 'Leadership Team', // You may want to add a role field to your database
		email: leader.Email
	}));

	return {
		leadership: leadershipData
	};
};
