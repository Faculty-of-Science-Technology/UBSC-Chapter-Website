import { DEBUG, IS_DEVELOPMENT, PLATFORM_ALLOWED_SOCIALS } from '$env/static/private';
import { db } from '$lib/server/db';
import { UserSkills, UserSocialLinks, Users } from '$lib/server/db/schema';
import { uploadFile } from '$lib/server/upload';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import validator from 'validator';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

const socialLinkSchema = z.object({
	platform: z.string({ required_error: 'You must define a platform' }).max(32),
	url: z
		.string({ required_error: 'Only text is allowed' })
		.refine(
			(e) => {
				if (e === '') return true;
				return validator.isURL(e);
			},
			{ message: "That doesn't look right. Check the URL and try again." }
		)
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
		.string({
			message: "That phone number doesn't look right. Try again."
		})
		.max(15)
		.optional(),
	bio: z.string().max(255, { message: 'Bios are cool, but yours is too long.' }).optional(),
	resume: z
		.instanceof(File, { message: 'Your resume is required' })
		.refine((f) => f.size < 5_000_000, 'Max 5 MB upload size.')
		.optional(),
	location: z
		.string()
		.max(255, { message: 'Your location is too long. Try something else' })
		.optional(),
	hireable: z.boolean({ required_error: 'You must show whether you are hireable' }),
	skills: z
		.array(z.string())
		.max(15, { message: 'You are too skillful. You can only add up to 15 skills' }),
	socials: z
		.array(socialLinkSchema)
		.max(4, { message: 'Social links are currently capped to 4 links' })
		.optional()
});

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || locals.user == undefined) {
		// Throw a 401 error if the user is not logged in
		throw redirect(301, '/auth/login');
	}
	const form = await superValidate(zod(profileSchema));

	// Load existing user data
	const userSkills = await db.query.UserSkills.findMany({
		where: eq(UserSkills.UserId, locals.user.Id)
	});

	const userSocials = await db.query.UserSocialLinks.findMany({
		where: eq(UserSocialLinks.UserId, locals.user.Id)
	});

	let userSocials_POJO = userSocials.map((social) => ({
		platform: social.Platform,
		url: social.Url
	}));

	// Add blank social entries if less than 4
	if (userSocials_POJO.length < 4) {
		const blankEntriesToAdd = 4 - userSocials_POJO.length;
		const allowedPlatforms: [string] = eval(PLATFORM_ALLOWED_SOCIALS); // Bad idea, but it's fine since it's static
		const existingPlatforms = userSocials_POJO.map((social) => social.platform);
		const nonExistingPlatforms = allowedPlatforms.filter(
			(platform) => !existingPlatforms.includes(platform)
		);
		const missingEntries = nonExistingPlatforms
			.slice(0, blankEntriesToAdd)
			.map((platform) => ({ platform, url: '' }));
		const blankEntries = missingEntries;

		userSocials_POJO = [...userSocials_POJO, ...blankEntries];
	}

	// Pre-fill the form with existing data
	form.data = {
		username: locals.user.Username,
		email: locals.user.Email,
		bio: locals.user.Bio ?? '',
		phone: locals.user.Phone ?? '',
		location: locals.user.Location ?? '',
		hireable: locals.user.Hireable,
		skills: userSkills.map((skill) => skill.Name),
		socials: userSocials_POJO
	};

	// Add 4 empty social links if none exist
	if (form.data.socials === undefined || form.data.socials.length === 0) {
		form.data.socials = Array.from({ length: 4 }, () => ({ platform: '', url: '' }));
	}

	return { form, user: locals.user };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user || locals.user == undefined) {
			throw error(401, { message: 'You must be logged in to view this page.' });
		}
		const form = await superValidate(request, zod(profileSchema));

		if (form.data.phone !== undefined && form.data.phone.trim() !== '') {
			if (JSON.parse(DEBUG)) {
				console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
				console.log('To disable this, set DEBUG to false in your .env file');
				console.log(form.data.phone);
			}
			if (!validator.isMobilePhone(form.data.phone)) {
				setError(form, 'phone', "That phone number doesn't look right. Try again.");
				form.valid = false;
			}
		}

		if (Boolean(JSON.parse(DEBUG) ?? JSON.parse(IS_DEVELOPMENT))) {
			console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
			console.log('To disable this, set DEBUG to false in your .env file');
			console.log('form', form);
		}
		if (!form.valid) {
			setError(form, '', 'You have some errors in your form. Please fix them and try again.');
			return fail(400, { form, user: locals.user });
		}
		try {
			// Upload the resume
			//const formData = await request.formData();
			const raw_resume: File = form.data.resume as File;
			let resume_url: string | null = null;
			if (raw_resume !== undefined) {
				resume_url = await uploadFile(raw_resume, 'application/pdf');
			}

			// Update user profile
			await db
				.update(Users)
				.set({
					Username: form.data.username.trim(),
					Email: form.data.email.trim(),
					Phone:
						form.data.phone !== undefined
							? form.data.phone.trim() === ''
								? null
								: form.data.phone.trim()
							: null,
					Bio: form.data.bio,
					ResumeUrl: resume_url,
					Location: form.data.location !== undefined ? form.data.location.trim() : null,
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

			if (form.data.socials === undefined || form.data.socials.length === 0) {
				form.data.socials = Array.from({ length: 4 }, () => ({ platform: '', url: '' }));
			}

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

			setMessage(form, 'Profile updated successfully');
			return { form, user: locals.user };
		} catch (e) {
			if (IS_DEVELOPMENT) console.log(e);
			setError(form, 'Failed to update profile');
			return { form, user: locals.user };
		}
	}
};
