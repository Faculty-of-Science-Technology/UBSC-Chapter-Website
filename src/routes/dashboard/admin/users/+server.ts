import { db } from '$lib/server/db';
import { UserRoles, Users } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    // Check if user has permission to manage Users
    if (!locals.user.Administrator && !locals.user.Permissions.CanManageUsers) {
        throw error(403, 'Forbidden');
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'create': {
                const { email, username, firstName, lastName, password, administrator, accountType } = body;

                // Validate required fields
                if (!email || !username || !firstName || !lastName || !password) {
                    throw error(400, 'Missing required fields');
                }

                // Check if user already exists
                const existingUser = await db
                    .select()
                    .from(Users)
                    .where(eq(Users.Email, email))
                    .limit(1);

                if (existingUser.length > 0) {
                    throw error(400, 'User with this email already exists');
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 12);

                // Create user
                const [newUser] = await db
                    .insert(Users)
                    .values({
                        AccountType: accountType || 'student',
                        Email: email,
                        Username: username,
                        FirstName: firstName,
                        LastName: lastName,
                        Password: hashedPassword,
                        Administrator: administrator || false,
                        CreatedAt: new Date()
                    })
                    .returning();

                return json({ success: true, user: newUser });
            }

            case 'update': {
                const { id, email, username, firstName, lastName, administrator, accountType } = body;

                if (!id) {
                    throw error(400, 'User ID is required');
                }

                // Update user
                const [updatedUser] = await db
                    .update(Users)
                    .set({
                        Email: email,
                        Username: username,
                        FirstName: firstName,
                        LastName: lastName,
                        Administrator: administrator || false,
                        AccountType: accountType
                    })
                    .where(eq(Users.Id, id))
                    .returning();

                if (!updatedUser) {
                    throw error(404, 'User not found');
                }

                return json({ success: true, user: updatedUser });
            }

            case 'delete': {
                const { userId } = body;

                if (!userId) {
                    throw error(400, 'User ID is required');
                }

                // Don't allow deleting yourself
                if (userId === locals.user.Id) {
                    throw error(400, 'Cannot delete your own account');
                }

                // Delete user roles first
                await db
                    .delete(UserRoles)
                    .where(eq(UserRoles.UserId, userId));

                // Delete user
                const deletedUsers = await db
                    .delete(Users)
                    .where(eq(Users.Id, userId))
                    .returning();

                if (deletedUsers.length === 0) {
                    throw error(404, 'User not found');
                }

                return json({ success: true });
            }

            case 'assign-role': {
                const { userId, roleId } = body;

                if (!userId || !roleId) {
                    throw error(400, 'User ID and Role ID are required');
                }

                // Check if role assignment already exists
                const existingAssignment = await db
                    .select()
                    .from(UserRoles)
                    .where(and(eq(UserRoles.UserId, userId), eq(UserRoles.RoleId, roleId)))
                    .limit(1);

                if (existingAssignment.length > 0) {
                    throw error(400, 'User already has this role');
                }

                // Assign role
                await db
                    .insert(UserRoles)
                    .values({
                        UserId: userId,
                        RoleId: roleId,
                        AssignedBy: locals.user.Id
                    });

                return json({ success: true });
            }

            case 'remove-role': {
                const { userId, roleId } = body;

                if (!userId || !roleId) {
                    throw error(400, 'User ID and Role ID are required');
                }

                // Remove role assignment
                const deletedAssignments = await db
                    .delete(UserRoles)
                    .where(and(eq(UserRoles.UserId, userId), eq(UserRoles.RoleId, roleId)))
                    .returning();

                if (deletedAssignments.length === 0) {
                    throw error(404, 'Role assignment not found');
                }

                return json({ success: true });
            }

            default:
                throw error(400, 'Invalid action');
        }
    } catch (err) {
        console.error('User management error:', err);
        if (err instanceof Error) {
            throw error(500, err.message);
        }
        throw error(500, 'Internal server error');
    }
};
