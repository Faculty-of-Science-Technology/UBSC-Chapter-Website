import { db } from '$lib/server/db';
import { InviteCodes, InviteCodeUsage, Roles, UserRoles, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { count, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    // Check if user has permission to manage invites
    const userPermissions = await db
        .select({
            administrator: Users.Administrator,
            canManageInvites: Roles.CanManageInvites
        })
        .from(Users)
        .leftJoin(UserRoles, eq(Users.Id, UserRoles.UserId))
        .leftJoin(Roles, eq(UserRoles.RoleId, Roles.Id))
        .where(eq(Users.Id, locals.user.Id));

    const hasPermission = userPermissions.some(perm => 
        perm.administrator || perm.canManageInvites
    );

    if (!hasPermission) {
        throw redirect(302, '/dashboard');
    }

    try {
        // Fetch all invite codes with usage statistics
        const inviteCodesWithStats = await db
            .select({
                id: InviteCodes.Id,
                code: InviteCodes.Code,
                description: InviteCodes.Description,
                maxUses: InviteCodes.MaxUses,
                currentUses: InviteCodes.CurrentUses,
                expiresAt: InviteCodes.ExpiresAt,
                isActive: InviteCodes.IsActive,
                createdBy: InviteCodes.CreatedBy,
                createdAt: InviteCodes.CreatedAt,
                usageCount: count(InviteCodeUsage.Id),
                creatorName: Users.FirstName,
                creatorLastName: Users.LastName
            })
            .from(InviteCodes)
            .leftJoin(InviteCodeUsage, eq(InviteCodes.Id, InviteCodeUsage.InviteCodeId))
            .leftJoin(Users, eq(InviteCodes.CreatedBy, Users.Id))
            .groupBy(InviteCodes.Id, Users.FirstName, Users.LastName)
            .orderBy(desc(InviteCodes.CreatedAt));

        // Calculate invite statistics
        const totalInvites = inviteCodesWithStats.length;
        const activeInvites = inviteCodesWithStats.filter(invite => {
            const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
            const isMaxedOut = invite.maxUses && invite.usageCount >= invite.maxUses;
            const isInactive = !invite.isActive;
            return !isExpired && !isMaxedOut && !isInactive;
        }).length;
        const totalUsages = inviteCodesWithStats.reduce((sum, invite) => sum + invite.usageCount, 0);

        // Get recent registrations
        const recentRegistrations = await db
            .select({
                id: InviteCodeUsage.Id,
                code: InviteCodes.Code,
                userName: Users.FirstName,
                userLastName: Users.LastName,
                userEmail: Users.Email,
                usedAt: InviteCodeUsage.UsedAt
            })
            .from(InviteCodeUsage)
            .leftJoin(InviteCodes, eq(InviteCodeUsage.InviteCodeId, InviteCodes.Id))
            .leftJoin(Users, eq(InviteCodeUsage.UserId, Users.Id))
            .orderBy(desc(InviteCodeUsage.UsedAt))
            .limit(10);

        return {
            invites: inviteCodesWithStats,
            stats: {
                totalInvites,
                activeInvites,
                totalUsages,
                expiredInvites: totalInvites - activeInvites
            },
            recentRegistrations
        };
    } catch (error) {
        console.error('Error loading invite codes:', error);
        return {
            invites: [],
            stats: {
                totalInvites: 0,
                activeInvites: 0,
                totalUsages: 0,
                expiredInvites: 0
            },
            recentRegistrations: []
        };
    }
};
