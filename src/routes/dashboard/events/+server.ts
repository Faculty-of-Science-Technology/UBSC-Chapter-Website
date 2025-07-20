import { db } from '$lib/server/db';
import { Posts } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'create': {
                const { title, content, eventStartTime, eventEndTime, eventLocation, eventMaxAttendees, agendaId, published } = body;

                if (!title || !content || !eventStartTime) {
                    throw error(400, 'Title, content, and event start time are required');
                }

                // Generate slug from title
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                await db.insert(Posts).values({
                    Title: title,
                    Slug: slug,
                    Content: content,
                    Type: 'EVENT',
                    EventStartTime: new Date(eventStartTime),
                    EventEndTime: eventEndTime ? new Date(eventEndTime) : null,
                    EventLocation: eventLocation || null,
                    EventMaxAttendees: eventMaxAttendees || null,
                    AgendaId: agendaId || null,
                    Published: published || false,
                    PublishedAt: published ? new Date() : null,
                    AuthorId: locals.user.Id,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date()
                });

                return json({ success: true });
            }

            case 'update': {
                const { id, title, content, eventStartTime, eventEndTime, eventLocation, eventMaxAttendees, agendaId, published } = body;

                if (!id || !title || !content || !eventStartTime) {
                    throw error(400, 'ID, title, content, and event start time are required');
                }

                // Generate slug from title
                const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                await db
                    .update(Posts)
                    .set({
                        Title: title,
                        Slug: slug,
                        Content: content,
                        EventStartTime: new Date(eventStartTime),
                        EventEndTime: eventEndTime ? new Date(eventEndTime) : null,
                        EventLocation: eventLocation || null,
                        EventMaxAttendees: eventMaxAttendees || null,
                        AgendaId: agendaId || null,
                        Published: published || false,
                        PublishedAt: published ? new Date() : null,
                        UpdatedAt: new Date()
                    })
                    .where(eq(Posts.Id, id));

                return json({ success: true });
            }

            case 'delete': {
                const { eventId } = body;

                if (!eventId) {
                    throw error(400, 'Event ID is required');
                }

                await db.delete(Posts).where(eq(Posts.Id, eventId));

                return json({ success: true });
            }

            case 'toggle-published': {
                const { eventId, published } = body;

                if (!eventId || typeof published !== 'boolean') {
                    throw error(400, 'Event ID and published status are required');
                }

                await db
                    .update(Posts)
                    .set({
                        Published: published,
                        PublishedAt: published ? new Date() : null,
                        UpdatedAt: new Date()
                    })
                    .where(eq(Posts.Id, eventId));

                return json({ success: true });
            }

            default:
                throw error(400, 'Invalid action');
        }
    } catch (err) {
        console.error('Events API error:', err);
        throw error(500, 'Internal server error');
    }
};
