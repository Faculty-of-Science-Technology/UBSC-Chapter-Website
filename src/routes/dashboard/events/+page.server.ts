import { db } from '$lib/server/db';
import { EventAttendees, Groups, Posts, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { count, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    try {
        // Fetch all events (posts with type 'EVENT')
        const events = await db
            .select({
                id: Posts.Id,
                title: Posts.Title,
                content: Posts.Content,
                type: Posts.Type,
                published: Posts.Published,
                eventStartTime: Posts.EventStartTime,
                eventEndTime: Posts.EventEndTime,
                eventLocation: Posts.EventLocation,
                eventMaxAttendees: Posts.EventMaxAttendees,
                eventCurrentAttendees: Posts.EventCurrentAttendees,
                createdAt: Posts.CreatedAt,
                updatedAt: Posts.UpdatedAt,
                authorId: Posts.AuthorId,
                authorName: Users.FirstName,
                authorLastName: Users.LastName
            })
            .from(Posts)
            .leftJoin(Users, eq(Posts.AuthorId, Users.Id))
            .where(eq(Posts.Type, 'EVENT'))
            .orderBy(desc(Posts.EventStartTime));

        // Get attendee counts for each event
        const eventIds = events.map(event => event.id);
        let attendeeCounts: { eventId: string; count: number }[] = [];
        
        if (eventIds.length > 0) {
            attendeeCounts = await db
                .select({
                    eventId: EventAttendees.PostId,
                    count: count(EventAttendees.Id).as('count')
                })
                .from(EventAttendees)
                .where(EventAttendees.PostId.in ? EventAttendees.PostId.in(eventIds) : eq(EventAttendees.PostId, eventIds[0]))
                .groupBy(EventAttendees.PostId);
        }

        // Create a map of attendee counts
        const attendeeCountMap = new Map<string, number>();
        for (const countData of attendeeCounts) {
            attendeeCountMap.set(countData.eventId, countData.count);
        }

        // Add attendee counts to events
        const eventsWithCounts = events.map(event => ({
            ...event,
            attendeeCount: attendeeCountMap.get(event.id) || 0
        }));

        // Fetch all groups for the create/edit form
        const availableGroups = await db
            .select({
                id: Groups.Id,
                name: Groups.Title,
                type: Groups.Type
            })
            .from(Groups)
            .orderBy(Groups.Title);

        return {
            events: eventsWithCounts,
            availableGroups
        };
    } catch (error) {
        console.error('Error loading events:', error);
        return {
            events: [],
            availableGroups: []
        };
    }
};
