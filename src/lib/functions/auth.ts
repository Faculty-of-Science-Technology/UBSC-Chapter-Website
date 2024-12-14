import { JWT_SECRET } from '$env/static/private';
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
		// console.log(jwt);
		// Is this less than 24 hours away from expiring?
		if (jwt.exp && jwt.exp - Date.now() / 1000 < 86400) {
			// Refresh the JWT
			const newJwt = Jwt.sign({ email: jwt['email'] }, JWT_SECRET, { expiresIn: '72h' });
			cookies.set('session', newJwt, { path: '/' });
			return true;
		}
		return true;
	} catch {
		return false;
	}
};
