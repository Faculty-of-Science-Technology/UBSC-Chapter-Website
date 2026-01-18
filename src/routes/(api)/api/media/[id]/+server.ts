import { db } from '$lib/server/db';
import { MediaPool } from '$lib/server/db/schema';
import { error, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: ServerLoad = async ({params}) => {
    if(params.id === undefined) {
        throw error(400, 'Bad Request');
    }
	const media = await db
		.select()
		.from(MediaPool)
		.where(eq(MediaPool.Id, params.id))
		.limit(1)
		.then((res) => res[0]);

	if (!media) {
		throw error(404, 'Media not found');
	}

	return new Response(media.File, {
		headers: {
			'Content-Type': media.MimeType,
			'Cache-Control': 'public, max-age=31536000'
		}
	});
}
