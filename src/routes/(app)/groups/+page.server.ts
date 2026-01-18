import { db } from '$lib/server/db';
import { Groups, Users } from '$lib/server/db/schema';
import { and, count, eq, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get all groups with members
	const groups = await db.query.Groups.findMany({
		with: {
			members: {
				with: {
					user: {
						columns: {
							Id: true,
							FirstName: true,
							LastName: true,
							ProfilePicture: true,
							AccountType: true
						}
					}
				}
			}
		}
	});

	// Get statistics for the page
	const [totalGroupsResult, totalMembersResult] = await Promise.all([
		db.select({ count: count() }).from(Groups).where(eq(Groups.IsActive, true)),
		db.select({ count: count() }).from(Users).where(
			and(isNull(Users.ActivationCode), eq(Users.Hidden, false))
		)
	]);

	const totalGroups = totalGroupsResult[0]?.count || 0;
	const totalMembers = totalMembersResult[0]?.count || 0;
	const activeGroups = groups.filter(group => group.IsActive).length;

	const statistics = {
		totalGroups,
		totalMembers,
		activeGroups
	};

	return {
		groups,
		statistics
	};
};
