import { MAIL_DISPLAYNAME, MAIL_USERNAME, PLATFORM_NAME } from '$env/static/private';
import type { AvatarData } from '$lib/assemblies';
import { sendMail } from '$lib/email';
import { db } from '$lib/server/db';
import { and, eq, isNull } from 'drizzle-orm';
import { fail, setError, setMessage } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

const eventRegisterSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }).trim(),
	name: z.string().min(1, { message: 'Your name is required' }).trim()
});

export const load: PageServerLoad = async (request) => {
	// Get all users who are interns (modify the query based on your database schema)
	const groups = await db.query.Groups.findMany({
		with: {
			members: {
				with: {
					user: true
				}
			}
		}
	});
	const users = await db.query.Users.findMany({
		where: (users) =>
			and(eq(users.AccountType, 'student'), isNull(users.ActivationCode), eq(users.Hidden, false)),
		columns: {
			Id: true,
			FirstName: true,
			LastName: true,
			Bio: true,
			Hireable: true,
			ProfilePicture: true,
			ActivationCode: true
		},
		limit: 50 // Limit to 50 interns for the grid
	});

	// Get all users who are organizations (modify the query based on your database schema)
	const orgs = await db.query.Users.findMany({
		where: (users, { eq }) => and(eq(users.AccountType, 'org'), eq(users.Hidden, false)),
		columns: {
			Id: true,
			FirstName: true,
			LastName: true,
			Bio: true,
			Hireable: true,
			ProfilePicture: true
		},
		limit: 50 // Limit to 50 orgs for the grid
	});

	// Get all users
	const avatar_data: AvatarData[] = users.map((user) => ({
		id: user.Id,
		image_url: user.ProfilePicture ?? '',
		name: `${user.FirstName} ${user.LastName}`,
		bio: user.Bio,
		hireable: user.Hireable,
		activation_code: user.ActivationCode
	}));

	// Get all organizations
	const org_avatar_data: AvatarData[] = orgs.map((user) => ({
		id: user.Id,
		image_url: user.ProfilePicture ?? '',
		name: `${user.FirstName} ${user.LastName}`,
		bio: user.Bio,
		hireable: user.Hireable
	}));
	// Get all presentation agendas with their events
	const agenda_groups = await db.query.Groups.findMany({
		with: {
			agenda: {
				with: {
					events: {
						orderBy: (events, { asc }) => [asc(events.StartTime)]
					}
				}
			}
		}
	});

	// Prepare agenda data for the frontend
	const agendas = agenda_groups.map((group) => ({
		groupId: group.Id,
		groupCreatedAt: group.CreatedAt,
		groupName: group.Title,
		agenda: group.agenda
	}));

	const form = await superValidate(request, zod(eventRegisterSchema));

	return {
		avatar_data,
		org_avatar_data,
		agendas,
		groups,
		form
	};
};

export const actions: Actions = {
	signUpForDefaultEvent: async ({ request }) => {
		// Validate form data using superValidate
		const form = await superValidate(request, zod(eventRegisterSchema));

		if (form.data.name.trim() === '') {
			setError(form, 'name', "That doesn't look right. Please enter a valid name.");
			return fail(400, { form });
		}

		// Return invalid form data if validation fails
		if (!form.valid) {
			setError(form, '', 'You have some errors in your form. Please fix them and try again.');
			return fail(400, { form });
		}

		// Send confirmation email
		await sendMail({
			from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
			to: form.data.email,
			subject: `Event Registration Confirmation - ${PLATFORM_NAME}`,
			body:
				`Hey there ${form.data.name},\nThanks for your interest in the event. ` +
				'Presentations span from May 8 to May 9.\n\nYou can join it here:\nhttps://us06web.zoom.us/j/' +
				`86803449142?pwd=T7tDCvQpKZ7j76swtHkVHzDRTnxKYX.1\n\nAll the best,\n${PLATFORM_NAME}`
		});

		// Return success
		setMessage(form, 'You have been successfully registered.');
		return { success: true, form };
	}
};
