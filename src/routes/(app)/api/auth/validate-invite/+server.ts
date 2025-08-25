import { InviteService } from '$lib/server/invites';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { code } = await request.json();

		if (!code) {
			return json({ error: 'Invite code is required' }, { status: 400 });
		}

		const result = await InviteService.validateInvite(code);

		if (!result.valid) {
			return json({ error: result.error }, { status: 400 });
		}

		return json({ valid: true, message: 'Invite code is valid' });
	} catch (error) {
		console.error('Invite validation endpoint error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
