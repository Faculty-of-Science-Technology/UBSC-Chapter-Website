import { checkAuth } from '$lib/functions/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const authenticated = await checkAuth(event);
	return {
		authenticated: authenticated
	};
};
