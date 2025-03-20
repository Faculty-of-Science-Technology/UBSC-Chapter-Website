import type { PageData } from './$types';

export interface RegisterForm extends PageData {
	data: {
		account_type: 'student' | 'host';
		full_name: string;
		email: string;
		password: string;
		password_confirmation: string;
		data: Record<string, string>;
	};
	form: { super_form: Record<string, string> };
}
