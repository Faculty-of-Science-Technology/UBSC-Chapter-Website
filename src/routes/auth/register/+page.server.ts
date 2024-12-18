import { ACT_JWT_SECRET } from '$env/static/private';
import { checkUser } from '$lib/functions/users';
import { db } from '$lib/server/db';
import { Users } from '$lib/server/db/schema';
import { fail, isRedirect, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';
import Jwt from 'jsonwebtoken';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
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
		const form = Object.fromEntries(formData);
		const cookies = event.cookies;

		try {
			registerSchema.parse(form);
			const super_form = await superValidate(formData, zod(registerSchema));

			// Check if the email already exists
			const user = await checkUser(Users.Email, super_form.data.email);
			if (user.length > 0) {
				return setError(super_form, 'email', 'Email already exists');
			}

			// Insert the user if the email doesn't exist
			const activation_code = Jwt.sign({ email: form.email }, ACT_JWT_SECRET, { expiresIn: '1h' });
			await db.insert(Users).values({
				AccountType: super_form.data.account_type,
				FirstName: super_form.data.full_name.split(' ')[0].trim(),
				LastName: super_form.data.full_name.split(' ')[1].trim(),
				Email: super_form.data.email,
				Password: await argon2.hash(super_form.data.password),
				ActivationCode: activation_code
			});
			cookies.set('message_title', 'Check Your Inbox', { path: '/' });
			cookies.set('message_title2', "Didn't get the message?", { path: '/' });
			cookies.set(
				'message_description',
				'Check your email for a verification link and click on it',
				{
					path: '/'
				}
			);
			cookies.set(
				'message_description2',
				`Try signing in on the login page to request another one. Note that links expire within 1 hour. ...You are in debug mode. Your code is: ${activation_code}`,
				{
					path: '/'
				}
			);
			cookies.set('message_button', 'Login', { path: '/' });
			cookies.set('message_button_path', 'auth/login', { path: '/' });
			cookies.set('authenticated', 'false', { path: '/' });

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

			return fail(400, {
				super_form
			});
		}
	}
};
