import { db } from '$lib/server/db';
import { MediaPool } from '$lib/server/db/schema';

export async function saveToMediaPool(data: Buffer, fileId: string, mimeType: string) {
	try {
		await db.insert(MediaPool).values({
			Id: fileId,
			File: data,
			MimeType: mimeType
		});
		return true;
	} catch {
		return false;
	}
}
