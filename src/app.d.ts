// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				Id: string;
				AccountType: 'host' | 'student' | 'owner';
				Administrator: boolean;
				FirstName: string;
				LastName: string;
				Email: string;
				Phone: string;
				ProfilePicture: string;
				CoverPhoto: string;
				Username: string;
				Password: string;
				ActivationCode: string | null;
				Bio: string;
				Hireable: boolean;
				CreatedAt: Date;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };

