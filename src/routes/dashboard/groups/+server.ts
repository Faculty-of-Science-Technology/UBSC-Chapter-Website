import { db } from '$lib/server/db';
import { GroupMembers, Groups, Users } from '$lib/server/db/schema';
import { error, isHttpError, json } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const action = url.searchParams.get('action');
    const groupId = url.searchParams.get('groupId');

    if (action === 'get-members' && groupId) {
        // Validate groupId format (UUID)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(groupId)) {
            throw error(400, 'Invalid group ID format');
        }

        try {
            const members = await db
                .select({
                    userId: GroupMembers.UserId,
                    firstName: Users.FirstName,
                    lastName: Users.LastName,
                    email: Users.Email,
                    username: Users.Username,
                    joinedAt: GroupMembers.CreatedAt
                })
                .from(GroupMembers)
                .innerJoin(Users, eq(GroupMembers.UserId, Users.Id))
                .where(eq(GroupMembers.GroupId, groupId))
                .orderBy(Users.FirstName, Users.LastName);

            return json({ members });
        } catch (err) {
            console.error('Error fetching group members:', err);
            throw error(500, 'Failed to fetch group members');
        }
    }

    throw error(400, 'Invalid request');
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'create': {
                const { title, description, type } = body;

                if (!title) {
                    throw error(400, 'Group title is required');
                }

                await db.insert(Groups).values({
                    Title: title,
                    Description: description || null,
                    Type: type || 'STANDARD',
                    IsActive: true,
                    CreatedBy: locals.user.Id
                });

                return json({ success: true });
            }

            case 'update': {
                const { id, title, description, type, isActive } = body;

                if (!id || !title) {
                    throw error(400, 'Group ID and title are required');
                }

                await db
                    .update(Groups)
                    .set({
                        Title: title,
                        Description: description || null,
                        Type: type || 'STANDARD',
                        IsActive: isActive !== false
                    })
                    .where(eq(Groups.Id, id));

                return json({ success: true });
            }

            case 'delete': {
                const { groupId } = body;

                if (!groupId) {
                    throw error(400, 'Group ID is required');
                }

                // Is this a system group?
                const group = await db
                    .select().from(Groups)
                    .where(eq(Groups.Id, groupId))
                    .limit(1)
                    .then(res => res[0]);
                if (!group) {
                    throw error(404, 'Group not found');
                }
                if (group.IsSystemRow) {
                    throw error(403, 'Cannot delete a system group');
                }

                // Delete group members first
                await db.delete(GroupMembers).where(eq(GroupMembers.GroupId, groupId));
                
                // Delete the group
                await db.delete(Groups).where(eq(Groups.Id, groupId));

                return json({ success: true });
            }

            case 'add-member': {
                const { groupId, userId } = body;

                if (!groupId || !userId) {
                    throw error(400, 'Group ID and user ID are required');
                }

                // Check if user is already a member
                const existingMember = await db
                    .select()
                    .from(GroupMembers)
                    .where(and(
                        eq(GroupMembers.GroupId, groupId),
                        eq(GroupMembers.UserId, userId)
                    ))
                    .limit(1);

                if (existingMember.length > 0) {
                    throw error(400, 'User is already a member of this group');
                }

                await db.insert(GroupMembers).values({
                    GroupId: groupId,
                    UserId: userId
                });

                return json({ success: true });
            }

            case 'remove-member': {
                const { groupId, userId } = body;

                if (!groupId || !userId) {
                    throw error(400, 'Group ID and user ID are required');
                }

                await db
                    .delete(GroupMembers)
                    .where(and(
                        eq(GroupMembers.GroupId, groupId),
                        eq(GroupMembers.UserId, userId)
                    ));

                return json({ success: true });
            }

            default:
                throw error(400, 'Invalid action');
        }
    } catch (err) {
        if (isHttpError(err)) throw err;
        console.error('Groups API error:', err);
        throw error(500, 'Internal server error');
    }
};
