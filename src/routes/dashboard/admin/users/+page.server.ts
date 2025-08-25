import { db } from '$lib/server/db';
import { Roles, UserRoles, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    // Check if user has permission to manage users
    if (!locals.user.Administrator && !locals.user.Permissions.CanManageUsers) {
        throw redirect(302, '/dashboard');
    }

    try {
        // Fetch all users with their roles
        const allUsers = await db
            .select({
                id: Users.Id,
                email: Users.Email,
                username: Users.Username,
                firstName: Users.FirstName,
                lastName: Users.LastName,
                administrator: Users.Administrator,
                accountType: Users.AccountType,
                createdAt: Users.CreatedAt,
                roleId: UserRoles.RoleId,
                roleName: Roles.Name,
                roleType: Roles.Type
            })
            .from(Users)
            .leftJoin(UserRoles, eq(Users.Id, UserRoles.UserId))
            .leftJoin(Roles, eq(UserRoles.RoleId, Roles.Id))
            .orderBy(desc(Users.CreatedAt));

        // Group users by their ID and aggregate roles
        const userMap = new Map();
        
        allUsers.forEach(user => {
            if (!userMap.has(user.id)) {
                userMap.set(user.id, {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    administrator: user.administrator,
                    accountType: user.accountType,
                    createdAt: user.createdAt,
                    roles: []
                });
            }
            
            if (user.roleId) {
                userMap.get(user.id).roles.push({
                    id: user.roleId,
                    name: user.roleName,
                    type: user.roleType
                });
            }
        });

        const usersWithRoles = Array.from(userMap.values());

        // Fetch all available roles for assignment
        const availableRoles = await db
            .select({
                id: Roles.Id,
                name: Roles.Name,
                type: Roles.Type,
                description: Roles.Description
            })
            .from(Roles)
            .orderBy(Roles.Name);

        return {
            users: usersWithRoles,
            availableRoles
        };
    } catch (error) {
        console.error('Error loading users:', error);
        return {
            users: [],
            availableRoles: []
        };
    }
};
