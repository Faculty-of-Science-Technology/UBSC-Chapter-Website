import { DEBUG, IS_DEVELOPMENT } from '$env/static/private';
import { checkAuth } from '$lib/functions/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const authenticated = await checkAuth(event);
	return {
		authenticated: authenticated,
		debug: JSON.parse(DEBUG || 'false') ?? JSON.parse(IS_DEVELOPMENT || 'false')
	};
};
