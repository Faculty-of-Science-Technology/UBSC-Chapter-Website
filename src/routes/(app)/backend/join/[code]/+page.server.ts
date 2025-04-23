import { db } from '$lib/server/db';
import { GroupMembers, Groups } from '$lib/server/db/schema';
import { error, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const joinSchema = z.object({
	code: z.string().uuid()
});

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, '✗ Unauthorized');
	}

	const form = await superValidate(zod(joinSchema));
	return { form };
};

export const actions: Actions = {
	join: async ({ request, locals, params }) => {
		if (!locals.user) {
			throw error(401, '✗ Unauthorized');
		}

		const data = await request.formData();
		data.set('code', params.code ?? '00000000-0000-0000-0000-000000000000');
		const form = await superValidate(data, zod(joinSchema));

		if (!form.valid || !params.code) {
			setError(form, '✗ Invalid form data');
			return { form };
		}

		// See if the group actually exists
		const group = await db.select().from(Groups).where(eq(Groups.Id, form.data.code)).execute();
		if (group.length === 0) {
			setError(form, '✗ Group not found');
			return { form };
		}

		// Check if the user is already a member of the group
		const existingMember = await db
			.select()
			.from(GroupMembers)
			.where(and(eq(GroupMembers.GroupId, form.data.code), eq(GroupMembers.UserId, locals.user.Id)))
			.execute();
		if (existingMember.length > 0) {
			setError(form, '✗ You are already a member of this group');
			return { form };
		}

		await db.insert(GroupMembers).values({
			GroupId: form.data.code,
			UserId: locals.user.Id
		});

		setMessage(form, '✓ You were added successfully');
		return { form };
	}
};
