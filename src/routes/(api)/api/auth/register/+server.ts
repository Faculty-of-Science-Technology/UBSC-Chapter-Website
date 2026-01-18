import { AuthService } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { firstName, lastName, email, username, password, phone, inviteCode } = await request.json();

		// Validate required fields
		if (!firstName || !lastName || !email || !username || !password || !inviteCode) {
			return json({ error: 'All required fields must be provided' }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Invalid email format' }, { status: 400 });
		}

		// Basic password validation (minimum 6 characters)
		if (password.length < 6) {
			return json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
		}

		// Username validation (3-16 characters, alphanumeric and underscore)
		const usernameRegex = /^\w{3,16}$/;
		if (!usernameRegex.test(username)) {
			return json({ error: 'Username must be 3-16 characters and contain only letters, numbers, and underscores' }, { status: 400 });
		}

		const result = await AuthService.registerUser({
			firstName,
			lastName,
			email,
			username,
			password,
			phone,
			inviteCode
		});

		if (!result.success) {
			return json({ error: result.error }, { status: 400 });
		}

		return json({ message: 'User registered successfully', userId: result.userId });
	} catch (error) {
		console.error('Registration endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
