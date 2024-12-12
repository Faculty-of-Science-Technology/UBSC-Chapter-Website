import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions } from './$types';

const registerSchema = z.object({
	account_type: z.enum(['student', 'host']),
	full_name: z.string().min(1).max(255),
	email: z.string().email(),
	password: z.string().min(8),
	password_confirmation: z.string().min(8)
});

export const load = async (request) => {
	const form = await superValidate(request, zod(registerSchema));
	return form;
};

export const actions: Actions = {
	default: async (event) => {
		// Just get all the values from the form without using superValidate
		// This is useful if you want to do something with the form data before validating it
		// const formData = Object.fromEntries(await event.request.formData());
		// console.log(formData);
		
		const form = await superValidate(event, zod(registerSchema));
		console.log(form);
	}
};
