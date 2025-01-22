export const NavLinks = {
	home: '-dashboard',
	profile: '-dashboard-profile',
	submissions: '-dashboard-submissions',
	new_listing: '-dashboard-jobs-new',
	manage_listings: '-dashboard-jobs',
	manage_applicants: '-dashboard-jobs-applicants',
	settings: '-dashboard-settings'
};

export const SettingsNavLinks = {
	profile: '-dashboard-settings',
	notifications: '-dashboard-settings-notifications',
	agenda: '-dashboard-settings-setup-agenda',
	users: '-dashboard-settings-manage-users',
	groups: '-dashboard-settings-manage-groups'
};

export const _Settings_NavLinkIndexes = {
	[SettingsNavLinks.profile]: 0,
	[SettingsNavLinks.notifications]: 1,
	[SettingsNavLinks.agenda]: 2,
	[SettingsNavLinks.users]: 3,
	[SettingsNavLinks.groups]: 4
};

const _NavLinkIndexes = {
	[NavLinks.home]: 0, // Exists
	[NavLinks.profile]: 1,
	[NavLinks.submissions]: 2,
	[NavLinks.new_listing]: 3, // Exists
	[NavLinks.manage_listings]: 4,
	[NavLinks.manage_applicants]: 5,
	[NavLinks.settings]: 6
};

type RepositoryParameter = {
	repository?: Record<string, number>;
};

export const NavLink = (url: string, { repository }: RepositoryParameter = {}): number => {
	const NavLinkRepository: Record<string, number> = repository || _NavLinkIndexes;
	if (url.includes('settings') && repository === undefined)
		return NavLinkRepository[NavLinks.settings];
	if (url in NavLinkRepository) {
		return NavLinkRepository[url];
	} else {
		return 0; // Default value if URL not found
	}
};
