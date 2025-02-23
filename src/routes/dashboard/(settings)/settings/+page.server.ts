import { IS_DEVELOPMENT } from '$env/static/private';
import { db } from '$lib/server/db';
import { UserSkills, UserSocialLinks, Users } from '$lib/server/db/schema';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import validator from 'validator';
import { z } from 'zod';

const socialLinkSchema = z.object({
	platform: z.string({ required_error: 'You must define a platform' }).max(32),
	url: z
		.string({ required_error: 'Only text is allowed' })
		.url({ message: "That doesn't look right. Check the URL and try again." })
		.optional()
});

const profileSchema = z.object({
	username: z
		.string()
		.min(3, { message: "That's way too short. Enter something longer than that." })
		.max(16, { message: "That's crazy. Usernames must be between 3 and 16 characters" }),
	email: z
		.string({
			required_error: "You haven't set a verified email address to display and use in applications."
		})
		.email({ message: "That email address doesn't look right. Try again." }),
	phone: z
		.string()
		.min(10, { message: 'That phone number is too short. Try again.' })
		.max(15, { message: 'That phone number is too long. Try again.' })
		.refine(validator.isMobilePhone, {
			message: "That phone number doesn't look right. Try again."
		})
		.optional(),
	bio: z.string().max(255, { message: 'Bios are cool, but yours is too long.' }).optional(),
	location: z
		.string()
		.max(255, { message: 'Your location is too long. Try something else' })
		.optional(),
	hireable: z.boolean({ required_error: 'You must show whether you are hireable' }),
	skills: z.array(z.string()),
	socials: z.array(socialLinkSchema)
});

export const load = async ({ locals }) => {
	if (!locals.user || locals.user == undefined) {
		// Throw a 401 error if the user is not logged in
		throw error(401, { message: 'You must be logged in to view this page.' });
	}
	const form = await superValidate(zod(profileSchema));

	// Load existing user data
	const userSkills = await db.query.UserSkills.findMany({
		where: eq(UserSkills.UserId, locals.user.Id)
	});

	const userSocials = await db.query.UserSocialLinks.findMany({
		where: eq(UserSocialLinks.UserId, locals.user.Id)
	});

	// Pre-fill the form with existing data
	form.data = {
		username: locals.user.Username,
		email: locals.user.Email,
		bio: locals.user.Bio || '',
		phone: locals.user.Phone || '',
		location: locals.user.Location || '',
		hireable: locals.user.Hireable,
		skills: userSkills.map((skill) => skill.Name),
		socials: userSocials.map((social) => ({
			platform: social.Platform,
			url: social.Url
		}))
	};

	// Add 4 empty social links if none exist
	if (form.data.socials.length === 0) {
		form.data.socials = Array.from({ length: 4 }, () => ({ platform: '', url: '' }));
	}

	return { form, user: locals.user };
};

export const actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || locals.user == undefined) {
			throw error(401, { message: 'You must be logged in to view this page.' });
		}
		const form = await superValidate(request, zod(profileSchema));

		if (IS_DEVELOPMENT) {
			console.log('form', form);
		}
		if (!form.valid) {
			return fail(400, { form, user: locals.user });
		}
		try {
			// Update user profile
			await db
				.update(Users)
				.set({
					Username: form.data.username,
					Email: form.data.email,
					Phone: form.data.phone,
					Bio: form.data.bio,
					Location: form.data.location,
					Hireable: form.data.hireable
				})
				.where(eq(Users.Id, locals.user.Id));

			// Update skills
			await db.delete(UserSkills).where(eq(UserSkills.UserId, locals.user.Id));

			if (form.data.skills.length > 0) {
				await db.insert(UserSkills).values(
					form.data.skills.map((skill) => ({
						UserId: locals.user!.Id,
						Name: skill
					}))
				);
			}

			// Update social links
			await db.delete(UserSocialLinks).where(eq(UserSocialLinks.UserId, locals.user.Id));

			const validSocials = form.data.socials.filter((s) => s.url);
			if (validSocials.length > 0) {
				await db.insert(UserSocialLinks).values(
					validSocials.map((social) => ({
						UserId: locals.user!.Id,
						Platform: social.platform,
						Url: social.url!
					}))
				);
			}

			return { form, user: locals.user };
		} catch (e) {
			if (IS_DEVELOPMENT) console.log(e);
			setError(form, 'Failed to update profile');
			return { form, user: locals.user };
		}
	}
};
