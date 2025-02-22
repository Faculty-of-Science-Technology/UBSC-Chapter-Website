import {
	ACT_JWT_SECRET,
	IS_DEVELOPMENT,
	JWT_SECRET,
	MAIL_DISPLAYNAME,
	MAIL_PASSWORD,
	MAIL_SIGNATURE,
	MAIL_USERNAME,
	PLATFORM_NAME,
	PLATFORM_URL,
	PLATFORM_URL_DEVELOPMENT
} from '$env/static/private';
import { getUser } from '$lib/functions/users';
import { db } from '$lib/server/db/index.js';
import { Users } from '$lib/server/db/schema.js';
import { fail, isActionFailure, isRedirect, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import Jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
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

			// Lookup the user by their email
			// db.select().from(Users).where(eq(Users.Email, super_form.data.email)).execute()
			const findUser = await getUser(Users.Email, super_form.data.email);

			// Check if the user exists
			if (!findUser) {
				return setError(super_form, 'password', 'Incorrect username or password');
			}
			const verificationResult = await argon2.verify(findUser.Password, super_form.data.password);
			if (!verificationResult) {
				return setError(super_form, 'password', 'Incorrect username or password');
			}
			if (findUser.ActivationCode !== null) {
				// Generate a new activation code
				const ActivationCode = Jwt.sign({ email: form.email }, ACT_JWT_SECRET, {
					expiresIn: '1h'
				});

				// Update the user's activation code
				await db
					.update(Users)
					.set({
						ActivationCode
					})
					.where(eq(Users.Email, super_form.data.email));

				// Send a new activation email
				sendNewActivationEmail(super_form.data.email, ActivationCode);
				return setError(
					super_form,
					'email',
					'Your account is not activated, please check your email for an activation link'
				);
			}

			// Assign the session
			cookies.set(
				'session',
				Jwt.sign({ email: form.email }, JWT_SECRET, {
					expiresIn: '72h' // 3 days
				}),
				{ path: '/', expires: new Date(Date.now() + 72 * 60 * 60 * 1000), sameSite: 'strict' }
			);

			throw redirect(303, '/dashboard');
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

function sendNewActivationEmail(email, activation_code) {
	// Fire up nodemailer
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: MAIL_USERNAME,
			pass: MAIL_PASSWORD
		}
	});

	transporter.sendMail({
		from: `"${MAIL_DISPLAYNAME}" <${MAIL_USERNAME}>`,
		to: email,
		subject: `Activate your account on ${PLATFORM_NAME}`,
		text: `Hey,\nThanks for considering ${PLATFORM_NAME}.\nTo begin, click on the following link to activate your account: ${IS_DEVELOPMENT ? PLATFORM_URL_DEVELOPMENT : PLATFORM_URL}/auth/activate?activation_code=${activation_code}\n\nThanks,\n${MAIL_SIGNATURE}`
	});
}
