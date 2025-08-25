import { db } from '$lib/server/db';
import { Groups, Posts } from '$lib/server/db/schema';
import { and, count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get all published events
	const events = await db.query.Posts.findMany({
		where: (posts) => and(eq(posts.Type, 'EVENT'), eq(posts.Published, true)),
		with: {
			author: {
				columns: {
					FirstName: true,
					LastName: true,
					ProfilePicture: true
				}
			}
		},
		orderBy: (posts, { desc }) => [desc(posts.EventStartTime)]
	});

	// Get available groups for the event details
	const availableGroups = await db.query.Groups.findMany({
		where: (groups) => eq(groups.IsActive, true),
		columns: {
			Id: true,
			Title: true,
			Type: true
		}
	});

	// Get statistics
	const [totalEventsResult, totalGroupsResult] = await Promise.all([
		db.select({ count: count() }).from(Posts).where(
			and(eq(Posts.Type, 'EVENT'), eq(Posts.Published, true))
		),
		db.select({ count: count() }).from(Groups).where(eq(Groups.IsActive, true))
	]);

	const totalEvents = totalEventsResult[0]?.count || 0;
	const totalGroups = totalGroupsResult[0]?.count || 0;

	// Calculate total attendees (this would need to be implemented based on your registration system)
	const totalAttendees = events.reduce((total, event) => {
		return total + (event.EventCurrentAttendees || 0);
	}, 0);

	// Transform events data
	const transformedEvents = events.map((event) => ({
		id: event.Id,
		title: event.Title,
		content: event.Content,
		eventStartTime: event.EventStartTime,
		eventLocation: event.EventLocation,
		eventPrice: event.EventPrice,
		eventCapacity: event.EventMaxAttendees,
		attendeeCount: event.EventCurrentAttendees || 0,
		featured: false, // You may want to add a Featured field to the schema
		published: event.Published,
		groupId: event.GroupId,
		authorName: event.author?.FirstName,
		authorLastName: event.author?.LastName,
		authorProfilePicture: event.author?.ProfilePicture
	}));

	const statistics = {
		totalEvents,
		totalGroups,
		totalAttendees
	};

	return {
		events: transformedEvents,
		availableGroups: availableGroups.map(group => ({
			id: group.Id,
			name: group.Title,
			type: group.Type
		})),
		statistics
	};
};
