import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, parent }) => {
	const authenticated = (await parent()).authenticated;
	if (locals.user && authenticated) {
		return {
			user: locals.user,
			authenticated
		};
	}
	throw error(401, '✗ Unauthorized');
};
