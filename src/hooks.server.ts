import { paraglideMiddleware } from '$lib/paraglide/server';
import { AuthService } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { isRedirect, redirect } from '@sveltejs/kit';

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

		// Protect admin theme route - require theme management permission
		if (event.url.pathname.startsWith('/dashboard/admin/theme')) {
			if (
				!event.locals.user ||
				(!event.locals.user.Administrator && !event.locals.user.Permissions.CanManageTheme)
			) {
				throw redirect(302, '/dashboard');
			}
		}
		// Protect other admin routes - require admin permissions
		else if (event.url.pathname.startsWith('/dashboard/admin')) {
			if (
				!event.locals.user ||
				(!event.locals.user.Administrator && !event.locals.user.Permissions.CanManageUsers)
			) {
				throw redirect(302, '/dashboard');
			}
		}

		// Redirect logged-in users away from auth pages
		if (event.url.pathname.startsWith('/auth/') && event.locals.user) {
			throw redirect(302, '/dashboard');
		}
	} catch (error) {
		// If it's a redirect, re-throw it
		if (isRedirect(error)) {
			throw error;
		}
		console.error('Authentication error:', error);
		// Clear invalid session
		cookies.delete('auth_token', { path: '/' });
	}

	const response = paraglideMiddleware(
		event.request,
		({ request: localizedRequest, locale }: { request: Request; locale: string }) => {
			event.request = localizedRequest;
			return resolve(event, {
				transformPageChunk: ({ html }: { html: string }) => {
					return html.replace('%lang%', locale);
				}
			});
		}
	);
	return response;
};
