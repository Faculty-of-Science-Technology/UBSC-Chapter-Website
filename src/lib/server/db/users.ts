import { db } from '$lib/server/db'; // Assuming you have a db instance exported from here
import { Users } from '$lib/server/db/schema';

export async function getUserEmails() {
	try {
		const users = await db.select({ email: Users.Email }).from(Users);
		return users.map((user) => user.email);
	} catch (error) {
		console.error('Error fetching user emails:', error);
		throw new Error('Failed to fetch user emails');
	}
}
