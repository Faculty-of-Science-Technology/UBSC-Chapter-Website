import { db } from '$lib/server/db';
import { UserRoles, Users } from '$lib/server/db/schema';
import { error, isHttpError, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	// Check if user is admin
	if (!locals.user.Administrator) {
		throw error(403, 'Forbidden: Admin access required');
	}

	try {
		const body = await request.json();
		const { action } = body;

		switch (action) {
			case 'update-member': {
				const { userId, firstName, lastName, email, phone, location, bio, hireable, administrator } = body;

				if (!userId) {
					throw error(400, 'User ID is required');
				}

				await db
					.update(Users)
					.set({
						FirstName: firstName,
						LastName: lastName,
						Email: email,
						Phone: phone || null,
						Location: location || null,
						Bio: bio || null,
						Hireable: hireable || false,
						Administrator: administrator || false
					})
					.where(eq(Users.Id, userId));

				return json({ success: true });
			}

			case 'toggle-member-status': {
				const { userId, hidden } = body;

				if (!userId || typeof hidden !== 'boolean') {
					throw error(400, 'User ID and status are required');
				}

				await db
					.update(Users)
					.set({
						Hidden: hidden
					})
					.where(eq(Users.Id, userId));

				return json({ success: true });
			}

			case 'assign-role': {
				const { userId, roleId } = body;

				if (!userId || !roleId) {
					throw error(400, 'User ID and role ID are required');
				}

				// Check if user already has this role
				const existingRole = await db
					.select()
					.from(UserRoles)
					.where(eq(UserRoles.UserId, userId))
					.where(eq(UserRoles.RoleId, roleId))
					.limit(1);

				if (existingRole.length > 0) {
					throw error(400, 'User already has this role');
				}

				await db.insert(UserRoles).values({
					UserId: userId,
					RoleId: roleId,
					AssignedBy: locals.user.Id
				});

				return json({ success: true });
			}

			case 'remove-role': {
				const { userId, roleId } = body;

				if (!userId || !roleId) {
					throw error(400, 'User ID and role ID are required');
				}

				await db
					.delete(UserRoles)
					.where(eq(UserRoles.UserId, userId))
					.where(eq(UserRoles.RoleId, roleId));

				return json({ success: true });
			}

			case 'delete-member': {
				const { userId } = body;

				if (!userId) {
					throw error(400, 'User ID is required');
				}

				// Soft delete by setting hidden to true
				await db
					.update(Users)
					.set({
						Hidden: true
					})
					.where(eq(Users.Id, userId));

				return json({ success: true });
			}

			default:
				throw error(400, 'Invalid action');
		}
	} catch (err) {
		if (isHttpError(err)) throw err;
		console.error('Members API error:', err);
		throw error(500, 'Internal server error');
	}
};
