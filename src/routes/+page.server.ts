import type { AvatarData } from '$lib/assemblies';
import { db } from '$lib/server/db';
import { and, eq, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get all users who are interns (modify the query based on your database schema)
	const groups = await db.query.Groups.findMany({
		with: {
			members: {
				with: {
					user: true
				}
			}
		}
	});
	const users = await db.query.Users.findMany({
		where: (users) => and(eq(users.AccountType, 'student'), isNull(users.ActivationCode)),
		columns: {
			Id: true,
			FirstName: true,
			LastName: true,
			Bio: true,
			Hireable: true,
			ProfilePicture: true,
			ActivationCode: true
		},
		limit: 50 // Limit to 50 interns for the grid
	});

	// Get all users who are organizations (modify the query based on your database schema)
	const orgs = await db.query.Users.findMany({
		where: (users, { eq }) => and(eq(users.AccountType, 'org')),
		columns: {
			Id: true,
			FirstName: true,
			LastName: true,
			Bio: true,
			Hireable: true,
			ProfilePicture: true
		},
		limit: 50 // Limit to 50 orgs for the grid
	});

	// Get all users
	const avatar_data: AvatarData[] = users.map((user) => ({
		id: user.Id,
		image_url: user.ProfilePicture ?? '',
		name: `${user.FirstName} ${user.LastName}`,
		bio: user.Bio,
		hireable: user.Hireable,
		activation_code: user.ActivationCode
	}));

	// Get all organizations
	const org_avatar_data: AvatarData[] = orgs.map((user) => ({
		id: user.Id,
		image_url: user.ProfilePicture ?? '',
		name: `${user.FirstName} ${user.LastName}`,
		bio: user.Bio,
		hireable: user.Hireable
	}));
	// Get all presentation agendas with their events
	const agenda_groups = await db.query.Groups.findMany({
		with: {
			agenda: {
				with: {
					events: true
				}
			}
		}
	});

	// Prepare agenda data for the frontend
	const agendas = agenda_groups.map((group) => ({
		groupId: group.Id,
		groupCreatedAt: group.CreatedAt,
		groupName: group.Title,
		agenda: group.agenda
	}));

	return {
		avatar_data,
		org_avatar_data,
		agendas,
		groups
	};
};
