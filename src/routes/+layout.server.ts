import { checkAuth } from '$lib/functions/auth';

export const load = async (event) => {
	const authenticated = await checkAuth(event);
	return {
		authenticated: authenticated
	};
};
