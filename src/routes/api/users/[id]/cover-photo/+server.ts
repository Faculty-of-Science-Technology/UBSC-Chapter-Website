import { db } from '$lib/server/db';
import { Users } from '$lib/server/db/schema';
import { uploadImage } from '$lib/server/upload'; // You'll need to implement this
import { error, json, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';


export const POST: ServerLoad = async ({ params, request, locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	if (locals.user.Id !== params.id) {
		throw error(403, 'Forbidden');
	}

	const formData = await request.formData();
	const file = formData.get('coverPhoto') as File;

	if (!file) {
		throw error(400, 'No file uploaded');
	}

	const url = await uploadImage(file);

	await db.update(Users).set({ CoverPhoto: url }).where(eq(Users.Id, params.id));

	return json({ url });
}
