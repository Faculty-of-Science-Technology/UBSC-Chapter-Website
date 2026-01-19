import { db } from '$lib/server/db';
import { Groups } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

const CHAPTER_OFFICERS_GROUP_ID = '33333333-3333-3333-3333-333333333333';

export const load: PageServerLoad = async () => {
	const group = await db.query.Groups.findFirst({
		where: eq(Groups.Id, CHAPTER_OFFICERS_GROUP_ID),
		with: {
			members: {
				with: {
					user: true
				}
			}
		}
	});

	return {
		officers:
			group?.members
				.filter((m) => m.user)
				.map((m) => ({
					id: m.user!.Id,
					firstName: m.user!.FirstName,
					lastName: m.user!.LastName,
					email: m.user!.Email,
					profilePicture: m.user!.ProfilePicture,
					role: 'Chapter Officer', // TODO: replace with Roles join via UserRoles
					bio: m.user?.Bio ?? null // ← nullable
				})) ?? []
	};
};
