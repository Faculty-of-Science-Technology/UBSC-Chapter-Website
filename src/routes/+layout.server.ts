import { checkAuth } from '$lib/functions/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const authenticated = await checkAuth(event);
	return {
		authenticated: authenticated
	};
};
