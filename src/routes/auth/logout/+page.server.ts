import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = (event) => {
	// Clear all cookies
	const cookies = event.cookies;

	if (cookies) {
		const allCookies = cookies.getAll();
		for (const cookie of allCookies) {
			cookies.set(cookie.name, '', { path: '/', expires: new Date(0) });
		}
	}
	throw redirect(303, '/');
};
