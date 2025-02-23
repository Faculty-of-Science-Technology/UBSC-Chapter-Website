// This file is responsible for uploading images to the server
// You can use this file to upload images to a service like Cloudinary, Imgur, etc.

import { generateId } from '$lib/utility/ids';
import { error } from '@sveltejs/kit';
import { saveToMediaPool } from './drivers/local';

export async function uploadImage(file: File): Promise<string> {
	const buffer = await file.arrayBuffer();
	const data = Buffer.from(buffer);
	const mimeType = file.type;

	if (!mimeType.startsWith('image/')) {
		throw new Error('Invalid file type. Only images are allowed.');
	}

	const id = generateId();
	const fileId = `${id}.${mimeType.split('/')[1]}`;

	const result = await saveToMediaPool(data, fileId, mimeType);

	if (!result) {
		throw error(500, 'Failed to save image');
	}

	return `/api/media/${fileId}`;
}
