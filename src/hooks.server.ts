import { i18n } from '$lib/i18n';
import { AuthService } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const handleI18n: Handle = i18n.handle();

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const authToken = cookies.get('auth_token');
	
	try {

		// Check if the user is authenticated
		if (authToken) {
			const authResult = await AuthService.verifyToken(authToken);
			if (authResult.success && authResult.user) {
				// Set the user in the event locals
				event.locals.user = authResult.user;
			} else {
				// Invalid token, clear it
				cookies.delete('auth_token', { path: '/' });
			}
		}

		// Protect dashboard routes - require authentication
		if (event.url.pathname.startsWith('/dashboard')) {
			if (!event.locals.user) {
				throw redirect(302, '/auth/login');
			}
		}

		// Protect admin routes - require admin permissions
		if (event.url.pathname.startsWith('/dashboard/admin')) {
			if (!event.locals.user || (!event.locals.user.Administrator && !event.locals.user.Permissions.CanManageUsers)) {
				throw redirect(302, '/dashboard');
			}
		}

		// Redirect logged-in users away from auth pages
		if (event.url.pathname.startsWith('/auth/') && event.locals.user) {
			throw redirect(302, '/dashboard');
		}

	} catch (error) {
		// If it's a redirect, re-throw it
		if (error instanceof Response && error.status >= 300 && error.status < 400) {
			throw error;
		}
		console.error('Authentication error:', error);
		// Clear invalid session
		cookies.delete('auth_token', { path: '/' });
	}

	const response = await handleI18n({ event, resolve });
	return response;
};
