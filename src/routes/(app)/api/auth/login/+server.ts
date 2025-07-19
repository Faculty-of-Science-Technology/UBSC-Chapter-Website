import { AuthService } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();

		// Validate required fields
		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		const result = await AuthService.loginUser({ email, password });

		if (!result.success) {
			return json({ error: result.error }, { status: 401 });
		}

		// Set HTTP-only cookie for authentication
		cookies.set('auth_token', result.token!, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/'
		});

		return json({ 
			message: 'Login successful', 
			user: result.user 
		});
	} catch (error) {
		console.error('Login endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
