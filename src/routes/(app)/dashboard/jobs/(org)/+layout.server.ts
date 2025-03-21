import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, request }) => {
	const user = locals.user;

	// Check if user is logged in
	if (!user) {
		throw redirect(302, '/login');
	}

	// Check if user is an organization or owner
	if (user.AccountType !== 'org' && user.AccountType !== 'owner') {
		throw redirect(302, '/dashboard');
	}

	// Is this a POST request
	if (request.method === 'POST') {
		if (user.AccountType !== 'org' && user.AccountType !== 'owner') {
			throw error(403, 'Forbidden');
		}
	}

	return {
		user
	};
};
