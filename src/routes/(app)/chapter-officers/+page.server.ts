import { db } from '$lib/server/db';
import { GroupMembers, Roles, UserRoles, Users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const CHAPTER_OFFICERS_GROUP_ID = '33333333-3333-3333-3333-333333333333';

export const load: PageServerLoad = async () => {
	const rows = await db
		.select({
			userId: Users.Id,
			firstName: Users.FirstName,
			lastName: Users.LastName,
			email: Users.Email,
			profilePicture: Users.ProfilePicture,
			bio: Users.Bio,
			roleName: Roles.Name
		})
		.from(GroupMembers)
		.leftJoin(Users, eq(GroupMembers.UserId, Users.Id))
		.leftJoin(UserRoles, eq(UserRoles.UserId, Users.Id))
		.leftJoin(Roles, eq(UserRoles.RoleId, Roles.Id))
		.where(eq(GroupMembers.GroupId, CHAPTER_OFFICERS_GROUP_ID));

	return {
		officers: rows.map((row) => ({
			id: row.userId,
			firstName: row.firstName,
			lastName: row.lastName,
			email: row.email,
			profilePicture: row.profilePicture,
			role: row.roleName ?? 'Chapter Officer',
			bio: row.bio ?? null
		}))
	};
};
