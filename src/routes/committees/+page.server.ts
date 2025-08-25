import { db } from '$lib/server/db';
import { Groups, Posts } from '$lib/server/db/schema';
import { and, count, eq } from 'drizzle-orm';
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
	const [totalGroupsResult, totalEventsResult] = await Promise.all([
		db.select({ count: count() }).from(Groups).where(eq(Groups.IsActive, true)),
		db.select({ count: count() }).from(Posts).where(
			and(eq(Posts.Type, 'EVENT'), eq(Posts.Published, true))
		)
	]);

	const totalGroups = totalGroupsResult[0]?.count || 0;
	const totalEvents = totalEventsResult[0]?.count || 0;

	// Calculate committee-specific statistics
	const committees = groups.filter(group => group.Type === 'COMMITTEE' && group.IsActive);
	const totalCommitteeMembers = committees.reduce((total, committee) => {
		return total + committee.members.filter(m => m.user).length;
	}, 0);

	const statistics = {
		totalGroups,
		totalEvents,
		totalCommitteeMembers
	};

	return {
		groups,
		statistics
	};
};
