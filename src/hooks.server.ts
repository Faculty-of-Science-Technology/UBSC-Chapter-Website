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
		event.locals.user = await getUser(Users.Email, jwt['email']);
		// response = await handleI18n({ event, resolve });
	} catch (e) {
		console.error(e);
		return await handleI18n({ event, resolve });
	}

	const response = await handleI18n({ event, resolve });
	return response;
};
