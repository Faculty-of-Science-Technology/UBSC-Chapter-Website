// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				Id: string;
				Email: string;
				Username: string;
				FirstName: string;
				LastName: string;
				AccountType: string;
				Administrator: boolean;
				Roles: string[];
				Permissions: {
					CanManageUsers: boolean;
					CanManageEvents: boolean;
					CanManageGroups: boolean;
					CanManagePosts: boolean;
					CanEditOthersPosts: boolean;
					CanManageRoles: boolean;
					CanManageInvites: boolean;
					CanManageTheme: boolean;
				};
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };

