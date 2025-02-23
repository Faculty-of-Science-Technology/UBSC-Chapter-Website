import { randomBytes } from 'crypto';

export function generateId(length: number = 21): string {
	return randomBytes(length)
		.toString('base64')
		.replace(/[^a-zA-Z0-9]/g, '')
		.substring(0, length);
}
