import { db } from '$lib/server/db';
import { InviteCodes, InviteCodeUsage } from '$lib/server/db/schema';
import { InviteService } from '$lib/server/invites';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    // Check if user has permission to manage invites
    if (!locals.user.Administrator && !locals.user.Permissions.CanManageInvites) {
        throw error(403, 'Forbidden');
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'create': {
                const { description, maxUses, expiresAt } = body;

                // Generate unique invite code
                const code = InviteService.generateInviteCode();

                // Create invite code
                const [newInvite] = await db
                    .insert(InviteCodes)
                    .values({
                        Code: code,
                        Description: description || null,
                        MaxUses: maxUses || 1,
                        ExpiresAt: expiresAt || null,
                        CreatedBy: locals.user.Id
                    })
                    .returning();

                return json({ success: true, invite: newInvite });
            }

            case 'delete': {
                const { inviteId } = body;

                if (!inviteId) {
                    throw error(400, 'Invite ID is required');
                }

                // Delete invite code usage records first
                await db
                    .delete(InviteCodeUsage)
                    .where(eq(InviteCodeUsage.InviteCodeId, inviteId));

                // Delete invite code
                const deletedInvites = await db
                    .delete(InviteCodes)
                    .where(eq(InviteCodes.Id, inviteId))
                    .returning();

                if (deletedInvites.length === 0) {
                    throw error(404, 'Invite code not found');
                }

                return json({ success: true });
            }

            default:
                throw error(400, 'Invalid action');
        }
    } catch (err) {
        console.error('Invite management error:', err);
        if (err instanceof Error) {
            throw error(500, err.message);
        }
        throw error(500, 'Internal server error');
    }
};
