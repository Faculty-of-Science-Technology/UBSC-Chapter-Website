import { ACT_JWT_SECRET, JWT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db/index.js';
import { Users } from '$lib/server/db/schema.js';
import { fail, isActionFailure, isRedirect, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import Jwt from 'jsonwebtoken';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const loginSchema = z.object({
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Invalid email address' })
		.trim(),
	password: z
		.string({ required_error: 'Password is required' })
		.min(8, { message: 'Password must be at least 8 characters long' })
		.trim()
});

export const load = async (event) => {
	const request = event.request;
	const cookies = event.cookies;
	const session = cookies.get('session');
	const authenticated = cookies.get('authenticated');
	if (session && authenticated) {
		throw redirect(303, '/dashboard');
	}
	return await superValidate(request, zod(loginSchema));
};

export const actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const form = Object.fromEntries(await formData);
		const cookies = event.cookies;

		try {
			loginSchema.parse(form);
			const super_form = await superValidate(formData, zod(loginSchema));
			cookies.set('message_title', 'Login Success', { path: '/' });
			cookies.set('message_title2', 'You are now signed in', { path: '/' });
			cookies.set('message_description', 'You are authenticated', {
				path: '/'
			});
			cookies.set('message_description2', 'Click below to go into your dashboard', {
				path: '/'
			});
			cookies.set('message_button_text', 'Go to Dashboard', { path: '/' });
			cookies.set('authenticated', 'true', { path: '/' });

			// Lookup the user by their email
			// db.select().from(Users).where(eq(Users.Email, super_form.data.email)).execute()
			const findUser = await db.query.Users.findFirst({
				where: eq(Users.Email, super_form.data.email)
			});

			// Check if the user exists
			if (!findUser) {
				return setError(super_form, 'password', 'Incorrect username or password');
			}
			const verificationResult = await argon2.verify(findUser.Password, super_form.data.password);
			if (!verificationResult) {
				return setError(super_form, 'password', 'Incorrect username or password');
			}
			if (findUser.ActivationCode) {
				await db
					.update(Users)
					.set({
						ActivationCode: Jwt.sign({ email: form.email }, ACT_JWT_SECRET, {
							expiresIn: '1h'
						})
					})
					.where(eq(Users.Email, super_form.data.email));
				return setError(
					super_form,
					'email',
					'Your account is not activated, please check your email for an activation link'
				);
			}
			console.log(findUser, Jwt);

			// Assign the session
			cookies.set(
				'session',
				Jwt.sign({ email: form.email }, JWT_SECRET, {
					expiresIn: '72h' // 3 days
				}),
				{ path: '/' }
			);

			throw redirect(303, '/backend/message');
		} catch (error) {
			if (isActionFailure(error)) {
				throw error;
			}
			// Check if this is a Redirect
			if (isRedirect(error)) {
				throw error;
			}
			const super_form = await superValidate(form, zod(loginSchema));
			// @ts-expect-error - We are deleting the password field from the form
			// Again, we don't to pass the password back to the client
			delete super_form.data.password;
			return fail(400, { super_form });
		}
	}
};
