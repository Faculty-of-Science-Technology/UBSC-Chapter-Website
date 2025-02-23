import type { AvatarData } from '$lib/assemblies';
import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get all users who are interns (modify the query based on your database schema)
	const users = await db.query.Users.findMany({
		where: (users, { eq }) => eq(users.AccountType, 'student'),
		columns: {
			Id: true,
			FirstName: true,
			LastName: true,
			Bio: true,
			Hireable: true,
			ProfilePicture: true
		},
		limit: 50 // Limit to 50 interns for the grid
	});

	const avatar_data: AvatarData[] = users.map((user) => ({
		id: user.Id,
		image_url: user.ProfilePicture ?? '',
		name: `${user.FirstName} ${user.LastName}`,
		bio: user.Bio,
		hireable: user.Hireable
	}));

	return {
		avatar_data
	};
};
