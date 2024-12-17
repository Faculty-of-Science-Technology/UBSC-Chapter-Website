// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				Id: string;
				AccountType: string;
				FirstName: string;
				LastName: string;
				Email: string;
				Password: string;
				ActivationCode: string | null;
				Bio: string;
				CreatedAt: Date;
				Hireable: boolean;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };

