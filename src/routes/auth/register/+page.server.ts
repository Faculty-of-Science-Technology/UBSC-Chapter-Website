import { db } from '$lib/server/db';
import { Users } from '$lib/server/db/schema';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import type { Actions } from './$types';

const registerSchema = z
	.object({
		account_type: z.enum(['student', 'host'], { message: "Choose either 'student' or 'host'" }),
		full_name: z
			.string({ required_error: 'Full name is required' })
			.regex(/^\S+\s\S+$/, {
				message: 'Full name must contain at least two words separated by a space'
			})
			.min(1, { message: 'Full name is too short' })
			.max(255, { message: 'Full name must be less than 255 characters long' })
			.trim(),
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Invalid email address' })
			.trim(),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters long' })
			.trim(),
		password_confirmation: z
			.string({ required_error: 'You need to type in your password again' })
			.min(8, { message: 'Password must be at least 8 characters long' })
			.trim()
	})
	.superRefine(({ password_confirmation, password }, ctx) => {
		if (password_confirmation !== password) {
			ctx.addIssue({
				code: 'custom',
				path: ['password'],
				message: 'Passwords do not match'
			});
		}
	});

export const load = async ({ request }) => {
	return await superValidate(request, zod(registerSchema));
};

export const actions: Actions = {
	register: async (event) => {
		const formData = await event.request.formData();
		const form = Object.fromEntries(await formData);
		const cookies = event.cookies;

		try {
			registerSchema.parse(form);
			const super_form = await superValidate(formData, zod(registerSchema));
			// console.log('SUCCESS', super_form);
			cookies.set('message_title', 'Verification Required', { path: '/' });
			cookies.set('message_title2', 'Check your email', { path: '/' });
			cookies.set('message_description', 'Please check your email for a verification link', {
				path: '/'
			});
			cookies.set('message_description2', 'Click the link in the email to verify your account', {
				path: '/'
			});
			cookies.set('authenticated', 'false', { path: '/' });
			await db.insert(Users).values({
				AccountType: super_form.data.account_type,
				FirstName: super_form.data.full_name.split(' ')[0],
				LastName: super_form.data.full_name.split(' ')[1],
				Email: super_form.data.email,
				Password: await argon2.hash(super_form.data.password),
				ActivationCode: uuidv4()
			});

			throw redirect(303, '/backend/message');
		} catch (e) {
			// Check if this is a Redirect
			if (isRedirect(e)) {
				throw e;
			}
			const super_form = await superValidate(form, zod(registerSchema));

			// @ts-expect-error - this is a hack to remove the password fields from the response
			delete super_form.data.password;
			// @ts-expect-error - we intentionally remove the password_confirmation field from the response
			// We don't want to be passing sensitive data back to the client
			delete super_form.data.password_confirmation;
			console.log(super_form);
			return fail(400, {
				super_form
			});
		}
	}
};
