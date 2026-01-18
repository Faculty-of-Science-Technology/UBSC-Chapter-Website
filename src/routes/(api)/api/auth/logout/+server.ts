import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Clear the authentication cookie
		cookies.delete('auth_token', {
			path: '/'
		});

		return json({ message: 'Logout successful' });
	} catch (error) {
		console.error('Logout endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
