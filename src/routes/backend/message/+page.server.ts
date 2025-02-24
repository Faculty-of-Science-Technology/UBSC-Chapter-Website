import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const load: PageServerLoad = ({ cookies }) => {
	const message_title = cookies.get('message_title');
	const message_title2 = cookies.get('message_title2');
	const message_description = cookies.get('message_description');
	const message_description2 = cookies.get('message_description2');
	const message_button = cookies.get('message_button');
	const message_button_path = cookies.get('message_button_path');
	const authenticated = cookies.get('authenticated');
	if (
		!message_title ||
		!message_title2 ||
		!message_description ||
		!message_description2 ||
		!authenticated
	) {
		cookies.delete('message_title', { path: '/' });
		cookies.delete('message_title2', { path: '/' });
		cookies.delete('message_description', { path: '/' });
		cookies.delete('message_description2', { path: '/' });
		cookies.delete('message_button', { path: '/' });
		cookies.delete('message_button_path', { path: '/' });
		throw redirect(303, '/');
	}
	return {
		message_title,
		message_description,
		message_title2,
		message_description2,
		message_button,
		message_button_path,
		authenticated
	};
};
