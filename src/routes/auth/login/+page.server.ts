import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
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

export const load = async ({ request }) => {
	return await superValidate(request, zod(loginSchema));
};

export const actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const form = Object.fromEntries(await formData);
		const cookies = event.cookies;

		try {
			loginSchema.parse(form);
			// const super_form = await superValidate(formData, zod(loginSchema));
			// console.log('SUCCESS', super_form);
			cookies.set('message_title', 'Login Success', { path: '/' });
			cookies.set('message_title2', 'You are now signed in', { path: '/' });
			cookies.set('message_description', 'You are authenticated', {
				path: '/'
			});
			cookies.set('message_description2', 'Click below to go into your dashboard', {
				path: '/'
			});
			cookies.set('authenticated', 'true', { path: '/' });
			throw redirect(303, '/backend/message');
		} catch (error) {
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
