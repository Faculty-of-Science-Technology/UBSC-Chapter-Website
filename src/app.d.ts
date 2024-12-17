// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: { Id: string; Password: string; Email: string }; // specify the correct type for user
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
