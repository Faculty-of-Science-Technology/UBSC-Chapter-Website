// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				Id: string;
				AccountType: 'org' | 'student' | 'owner';
				Administrator: boolean;
				FirstName: string;
				LastName: string;
				Email: string;
				Phone: string | null;
				Location: string | null;
				ProfilePicture: string | null;
				CoverPhoto: string | null;
				Username: string;
				Password: string;
				ActivationCode: string | null;
				Bio: string | null;
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

