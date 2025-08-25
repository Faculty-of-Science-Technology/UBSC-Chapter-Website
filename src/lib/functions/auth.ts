import {
	JWT_SECRET,
	SESSION_HTTP_ONLY,
	SESSION_MAX_AGE,
	SESSION_SAMESITE,
	SESSION_SECURE
} from '$env/static/private';
import { type ServerLoadEvent } from '@sveltejs/kit';
import Jwt from 'jsonwebtoken';

export const checkAuth = async (event: ServerLoadEvent) => {
	const cookies = event.cookies;
	const authenticated = cookies.get('session');

	if (!authenticated) {
		return false;
	}

	// Verify the JWT
	try {
		const jwt: Jwt.JwtPayload = Jwt.verify(authenticated, JWT_SECRET) as Jwt.JwtPayload;
		if (!jwt) {
			return false;
		}

		// Is this less than 24 hours away from expiring?
		if (jwt.exp && jwt.exp - Date.now() / 1000 < 86400) {
			// Refresh the JWT
			const newJwt = Jwt.sign({ email: jwt.email }, JWT_SECRET, { expiresIn: '72h' });
			cookies.set('session', newJwt, {
				path: '/',
				expires: new Date(Date.now() + parseInt(SESSION_MAX_AGE) * 60 * 60 * 1000),
				secure: JSON.parse(SESSION_SECURE),
				httpOnly: JSON.parse(SESSION_HTTP_ONLY),
				sameSite: SESSION_SAMESITE as boolean | 'lax' | 'strict' | 'none' | undefined
			});
			return true;
		}
		return true;
	} catch {
		return false;
	}
};
