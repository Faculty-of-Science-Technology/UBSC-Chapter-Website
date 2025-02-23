import { IS_DEVELOPMENT } from '$env/static/private';
import { db } from '$lib/server/db';
import { Users, UserSkills, UserSocialLinks } from '$lib/server/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async (event) => {
	// Check if user is authenticated
	const user = event.locals.user;
	if (!user) {
		throw redirect(301, '/auth/login');
	}
	// Get the person ID from the URL
	const personId = event.params.person;
	// Fetch the person's data
	const person = await db
		.select()
		.from(Users)
		.where(eq(Users.Id, personId))
		.limit(1)
		.then((res) => res[0])
		.catch((e) => {
            if(IS_DEVELOPMENT) console.log(e);
			throw error(404, {
				message: 'Person not found'
			});
		});

	if (!person) {
		throw error(404, {
			message: 'Person not found'
		});
	}

	// Fetch their skills
	const skills = await db.select().from(UserSkills).where(eq(UserSkills.UserId, personId));

	// Fetch their social links
	const socials = await db
		.select()
		.from(UserSocialLinks)
		.where(eq(UserSocialLinks.UserId, personId))
		.then((links) => {
			// Convert array of links to an object
			return links.reduce(
				(acc, link) => ({
					...acc,
					[link.Platform]: link.Url
				}),
				{}
			);
		});

	// Return the data
	return {
		person: {
			...person,
			Skills: skills.map((skill) => skill.Name),
			Socials: socials
		},
		isOwner: user.Id === personId
	};
};
