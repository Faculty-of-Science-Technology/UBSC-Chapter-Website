import { db } from '$lib/server/db';
import { Groups, Posts, Users } from '$lib/server/db/schema';
import { and, count, eq, gte, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

function getChangeType(change: number): 'increase' | 'decrease' | 'neutral' {
	if (change > 0) return 'increase';
	if (change < 0) return 'decrease';
	return 'neutral';
}

export const load: PageServerLoad = async () => {
	try {
		// Get dashboard stats
		const [totalMembersResult, activeEventsResult, blogPostsResult, activeGroupsResult] =
			await Promise.all([
				// Total Members
				db.select({ count: count() }).from(Users),
				// Active Events (upcoming events)
				db
					.select({ count: count() })
					.from(Posts)
					.where(
						and(
							eq(Posts.Type, 'EVENT'),
							eq(Posts.Published, true),
							gte(Posts.EventStartTime, new Date())
						)
					),
				// Blog Posts (published)
				db
					.select({ count: count() })
					.from(Posts)
					.where(and(eq(Posts.Type, 'BLOG'), eq(Posts.Published, true))),
				// Active Groups
				db.select({ count: count() }).from(Groups).where(eq(Groups.IsActive, true))
			]);

		// Get upcoming events (next 5 events)
		const upcomingEvents = await db
			.select({
				id: Posts.Id,
				title: Posts.Title,
				startTime: Posts.EventStartTime,
				endTime: Posts.EventEndTime,
				location: Posts.EventLocation,
				currentAttendees: Posts.EventCurrentAttendees,
				maxAttendees: Posts.EventMaxAttendees
			})
			.from(Posts)
			.where(
				and(
					eq(Posts.Type, 'EVENT'),
					eq(Posts.Published, true),
					gte(Posts.EventStartTime, new Date())
				)
			)
			.orderBy(Posts.EventStartTime)
			.limit(5);

		// Calculate previous period stats for comparison (30 days ago)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const [previousMembersResult, previousEventsResult, previousPostsResult, previousGroupsResult] =
			await Promise.all([
				db
					.select({ count: count() })
					.from(Users)
					.where(sql`${Users.CreatedAt} < ${thirtyDaysAgo}`),
				db
					.select({ count: count() })
					.from(Posts)
					.where(
						and(
							eq(Posts.Type, 'EVENT'),
							eq(Posts.Published, true),
							sql`${Posts.PublishedAt} < ${thirtyDaysAgo}`
						)
					),
				db
					.select({ count: count() })
					.from(Posts)
					.where(
						and(
							eq(Posts.Type, 'BLOG'),
							eq(Posts.Published, true),
							sql`${Posts.PublishedAt} < ${thirtyDaysAgo}`
						)
					),
				db
					.select({ count: count() })
					.from(Groups)
					.where(and(eq(Groups.IsActive, true), sql`${Groups.CreatedAt} < ${thirtyDaysAgo}`))
			]);

		// Calculate changes
		const totalMembers = totalMembersResult[0]?.count || 0;
		const previousMembers = previousMembersResult[0]?.count || 0;
		const membersChange = totalMembers - previousMembers;

		const activeEvents = activeEventsResult[0]?.count || 0;
		const previousEvents = previousEventsResult[0]?.count || 0;
		const eventsChange = activeEvents - previousEvents;

		const blogPosts = blogPostsResult[0]?.count || 0;
		const previousPosts = previousPostsResult[0]?.count || 0;
		const postsChange = blogPosts - previousPosts;

		const activeGroups = activeGroupsResult[0]?.count || 0;
		const previousGroups = previousGroupsResult[0]?.count || 0;
		const groupsChange = activeGroups - previousGroups;

		return {
			stats: {
				totalMembers: {
					value: totalMembers,
					change: membersChange,
					changeType: getChangeType(membersChange)
				},
				activeEvents: {
					value: activeEvents,
					change: eventsChange,
					changeType: getChangeType(eventsChange)
				},
				blogPosts: {
					value: blogPosts,
					change: postsChange,
					changeType: getChangeType(postsChange)
				},
				activeGroups: {
					value: activeGroups,
					change: groupsChange,
					changeType: getChangeType(groupsChange)
				}
			},
			upcomingEvents: upcomingEvents.map((event) => ({
				id: event.id,
				title: event.title,
				date: event.startTime ? new Date(event.startTime).toLocaleDateString() : '',
				time: event.startTime
					? new Date(event.startTime).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})
					: '',
				attendees: event.currentAttendees || 0,
				location: event.location || 'TBD'
			}))
		};
	} catch (error) {
		console.error('Error loading dashboard data:', error);
		// Return empty data structure on error
		return {
			stats: {
				totalMembers: { value: 0, change: 0, changeType: 'neutral' as const },
				activeEvents: { value: 0, change: 0, changeType: 'neutral' as const },
				blogPosts: { value: 0, change: 0, changeType: 'neutral' as const },
				activeGroups: { value: 0, change: 0, changeType: 'neutral' as const }
			},
			upcomingEvents: []
		};
	}
};
