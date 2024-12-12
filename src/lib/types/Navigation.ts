export const NavLinks = {
	home: '-dashboard',
	profile: '-dashboard-profile',
	submissions: '-dashboard-submissions',
	new_listing: '-dashboard-jobs-new',
	manage_listings: '-dashboard-jobs-manage',
	manage_applicants: '-dashboard-jobs-applicants',
	settings: '-dashboard-settings'
};

export const NavLinkIndexes = {
	[NavLinks.home]: 0, // Exists
	[NavLinks.profile]: 1,
	[NavLinks.submissions]: 2,
	[NavLinks.new_listing]: 3, // Exists
	[NavLinks.manage_listings]: 4,
	[NavLinks.manage_applicants]: 5,
	[NavLinks.settings]: 6
};
