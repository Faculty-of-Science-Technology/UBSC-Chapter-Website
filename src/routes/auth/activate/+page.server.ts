import { ACT_JWT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db/index.js';
import { Users } from '$lib/server/db/schema.js';
import { isRedirect, redirect, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import Jwt from 'jsonwebtoken';

export const load: ServerLoad = async (event) => {
	// Get page query parameters
	const { cookies, url } = event;
	const query = new URLSearchParams(url.search);
	const activation_code = query.get('activation_code');
	if (!activation_code) {
		throw redirect(301, '/auth/login');
	}

	// Verify the JWT
	try {
		const jwt: Jwt.JwtPayload = Jwt.verify(activation_code, ACT_JWT_SECRET) as Jwt.JwtPayload;
		if (!jwt) {
			throw redirect(301, '/auth/login');
		}
		// Is this expired?
		if (jwt.exp && Date.now() > jwt.exp * 1000) {
			throw redirect(301, '/auth/login');
		}
		await db
			.update(Users)
			.set({
				ActivationCode: null
			})
			.where(eq(Users.Email, jwt['email']));
		cookies.set('message_title', 'Activation Successful', { path: '/' });
		cookies.set('message_title2', 'Your account has been activated', { path: '/' });
		cookies.set('message_description', 'You can now log in with your credentials', {
			path: '/'
		});
		cookies.set('message_description2', 'Click below to proceed to the login page', {
			path: '/'
		});
		cookies.set('message_button', 'Login', { path: '/' });
		cookies.set('message_button_path', 'auth/login', { path: '/' });
		cookies.set('authenticated', 'false', { path: '/' });
		throw redirect(301, '/backend/message');
	} catch (e) {
		if (isRedirect(e)) {
			throw e;
		}
		throw redirect(301, '/auth/login');
	}
};
