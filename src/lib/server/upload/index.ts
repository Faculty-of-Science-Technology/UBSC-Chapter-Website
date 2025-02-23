// This file is responsible for uploading images to the server
// You can use this file to upload images to a service like Cloudinary, Imgur, etc.

import { db } from '$lib/server/db';
import { MediaPool } from '$lib/server/db/schema';
import { generateId } from '$lib/utility/ids';

export async function uploadImage(file: File): Promise<string> {
	const buffer = await file.arrayBuffer();
	const data = Buffer.from(buffer);
	const mimeType = file.type;

	if (!mimeType.startsWith('image/')) {
		throw new Error('Invalid file type. Only images are allowed.');
	}

	const id = generateId();
	const fileId = `${id}.${mimeType.split('/')[1]}`;

	await db.insert(MediaPool).values({
		Id: fileId,
		File: data,
		MimeType: mimeType
	});

	return `/api/media/${fileId}`;
}
