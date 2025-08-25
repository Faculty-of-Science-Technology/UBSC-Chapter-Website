import { db } from '$lib/server/db';
import { Roles, UserRoles } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { count, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    // Check if user has permission to manage roles
    if (!locals.user.Administrator && !locals.user.Permissions.CanManageRoles) {
        throw redirect(302, '/dashboard');
    }

    try {
        // Fetch all roles with user count
        const rolesWithCounts = await db
            .select({
                id: Roles.Id,
                name: Roles.Name,
                description: Roles.Description,
                type: Roles.Type,
                color: Roles.Color,
                canManageUsers: Roles.CanManageUsers,
                canManageRoles: Roles.CanManageRoles,
                canManageEvents: Roles.CanManageEvents,
                canManagePosts: Roles.CanManagePosts,
                canManageGroups: Roles.CanManageGroups,
                canManageInvites: Roles.CanManageInvites,
                canManageTheme: Roles.CanManageTheme,
                canEditOthersPosts: Roles.CanEditOthersPosts,
                createdAt: Roles.CreatedAt,
                userCount: count(UserRoles.UserId)
            })
            .from(Roles)
            .leftJoin(UserRoles, eq(Roles.Id, UserRoles.RoleId))
            .groupBy(Roles.Id)
            .orderBy(desc(Roles.CreatedAt));

        return {
            roles: rolesWithCounts
        };
    } catch (error) {
        console.error('Error loading roles:', error);
        return {
            roles: []
        };
    }
};
