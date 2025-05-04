import { PLATFORM_PRIVATE_ACCOUNT_MODE } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent, request }) => {
	const authenticated = (await parent()).authenticated;
	if (locals.user && authenticated) {
		return {
			user: locals.user,
			authenticated
		};
	}

	if (
		!request.url.includes('/dashboard/people/') &&
		!request.url.includes('/dashboard/organizations/')
	) {
		throw error(401, '✗ Unauthorized');
	}

	if (JSON.parse(PLATFORM_PRIVATE_ACCOUNT_MODE) === false) {
		return {
			user: {
				AccountType: null,
				Email: null,
				Id: null
			},
			authenticated: false
		};
	} else {
		throw error(401, '✗ Unauthorized');
	}
};
