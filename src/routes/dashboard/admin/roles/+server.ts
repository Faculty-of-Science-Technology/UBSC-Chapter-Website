import { db } from '$lib/server/db';
import { Roles, UserRoles } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    // Check if user has permission to manage roles
    if (!locals.user.administrator && !locals.user.permissions.canManageRoles) {
        throw error(403, 'Forbidden');
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'create': {
                const {
                    name,
                    description,
                    type,
                    canManageUsers,
                    canManageRoles,
                    canManageEvents,
                    canManagePosts,
                    canEditOthersPosts,
                    canManageGroups,
                    canManageInvites,
                    canManageTheme
                } = body;

                // Validate required fields
                if (!name) {
                    throw error(400, 'Role name is required');
                }

                if (!type) {
                    throw error(400, 'Role type is required');
                }

                // Check if role already exists
                const existingRole = await db
                    .select()
                    .from(Roles)
                    .where(eq(Roles.Name, name))
                    .limit(1);

                if (existingRole.length > 0) {
                    throw error(400, 'Role with this name already exists');
                }

                // Create role
                const [newRole] = await db
                    .insert(Roles)
                    .values({
                        Name: name,
                        Description: description || null,
                        Type: type,
                        CanManageUsers: canManageUsers || false,
                        CanManageRoles: canManageRoles || false,
                        CanManageEvents: canManageEvents || false,
                        CanManagePosts: canManagePosts || false,
                        CanEditOthersPosts: canEditOthersPosts || false,
                        CanManageGroups: canManageGroups || false,
                        CanManageInvites: canManageInvites || false,
                        CanManageTheme: canManageTheme || false
                    })
                    .returning();

                return json({ success: true, role: newRole });
            }

            case 'update': {
                const {
                    id,
                    name,
                    description,
                    type,
                    canManageUsers,
                    canManageRoles,
                    canManageEvents,
                    canManagePosts,
                    canEditOthersPosts,
                    canManageGroups,
                    canManageInvites,
                    canManageTheme
                } = body;

                if (!id) {
                    throw error(400, 'Role ID is required');
                }

                if (!name) {
                    throw error(400, 'Role name is required');
                }

                if (!type) {
                    throw error(400, 'Role type is required');
                }

                // Update role
                const [updatedRole] = await db
                    .update(Roles)
                    .set({
                        Name: name,
                        Description: description || null,
                        Type: type,
                        CanManageUsers: canManageUsers || false,
                        CanManageRoles: canManageRoles || false,
                        CanManageEvents: canManageEvents || false,
                        CanManagePosts: canManagePosts || false,
                        CanEditOthersPosts: canEditOthersPosts || false,
                        CanManageGroups: canManageGroups || false,
                        CanManageInvites: canManageInvites || false,
                        CanManageTheme: canManageTheme || false
                    })
                    .where(eq(Roles.Id, id))
                    .returning();

                if (!updatedRole) {
                    throw error(404, 'Role not found');
                }

                return json({ success: true, role: updatedRole });
            }

            case 'delete': {
                const { roleId } = body;

                if (!roleId) {
                    throw error(400, 'Role ID is required');
                }

                // Delete all user role assignments first
                await db
                    .delete(UserRoles)
                    .where(eq(UserRoles.RoleId, roleId));

                // Delete role
                const deletedRoles = await db
                    .delete(Roles)
                    .where(eq(Roles.Id, roleId))
                    .returning();

                if (deletedRoles.length === 0) {
                    throw error(404, 'Role not found');
                }

                return json({ success: true });
            }

            default:
                throw error(400, 'Invalid action');
        }
    } catch (err) {
        console.error('Role management error:', err);
        if (err instanceof Error) {
            throw error(500, err.message);
        }
        throw error(500, 'Internal server error');
    }
};
