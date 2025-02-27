import { JWT_SECRET } from '$env/static/private';
import { getUser } from '$lib/functions/users';
import { i18n } from '$lib/i18n';
import { Users } from '$lib/server/db/schema';
import type { Handle } from '@sveltejs/kit';
import Jwt from 'jsonwebtoken';
const handleI18n: Handle = i18n.handle();
export const handle: Handle = async ({ event, resolve }) => {
	try {
		const cookies = event.cookies;
		const session = cookies.get('session');

		// Check if the user is authenticated
		if (!session) return await handleI18n({ event, resolve });
		const jwt: Jwt.JwtPayload = Jwt.verify(session, JWT_SECRET) as Jwt.JwtPayload;
		if (!jwt) return await handleI18n({ event, resolve });

		// Get the user's raw data from the database
		const temp_user = await getUser(Users.Email, jwt['email']);
		if (!temp_user) throw new Error('User not found');

		// Cast the raw data to the User type
		const new_user: App.Locals['user'] = temp_user as unknown as App.Locals['user'];
		if(!new_user) throw new Error('User not found');

		// Reassign the correct types to the user object
		new_user.CreatedAt = new Date(temp_user.CreatedAt);
		
		// Set the user in the event locals
		event.locals.user = new_user;
		
		// response = await handleI18n({ event, resolve });
	} catch (e) {
		console.error(e);
		return await handleI18n({ event, resolve });
	}

	const response = await handleI18n({ event, resolve });
	return response;
};
