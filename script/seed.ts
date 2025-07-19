import { hash } from 'argon2';
import { InviteCodes, Roles, UserRoles, Users } from '../src/lib/server/db/schema.ts';
import { db } from './support/db.ts';

async function seed() {
	console.log('🌱 Seeding database...');

	try {
		// Create default roles
		console.log('Creating default roles...');
		
		const adminRole = await db.insert(Roles).values({
			Name: 'Administrator',
			Description: 'Full system administrator with all permissions',
			Type: 'ADMIN',
			CanManageUsers: true,
			CanManageEvents: true,
			CanManageGroups: true,
			CanManagePosts: true,
			CanEditOthersPosts: true,
			CanManageRoles: true,
			CanManageInvites: true,
			CanManageTheme: true
		}).returning();

		await db.insert(Roles).values({
			Name: 'Moderator',
			Description: 'Community moderator with content management permissions',
			Type: 'MODERATOR',
			CanManageUsers: false,
			CanManageEvents: true,
			CanManageGroups: true,
			CanManagePosts: true,
			CanEditOthersPosts: true,
			CanManageRoles: false,
			CanManageInvites: false,
			CanManageTheme: false
		});

		await db.insert(Roles).values({
			Name: 'Event Manager',
			Description: 'Manages events and related activities',
			Type: 'EVENT_MANAGER',
			CanManageUsers: false,
			CanManageEvents: true,
			CanManageGroups: false,
			CanManagePosts: false,
			CanEditOthersPosts: false,
			CanManageRoles: false,
			CanManageInvites: false,
			CanManageTheme: false
		});

		await db.insert(Roles).values({
			Name: 'Content Manager',
			Description: 'Manages blog posts and content',
			Type: 'CONTENT_MANAGER',
			CanManageUsers: false,
			CanManageEvents: false,
			CanManageGroups: false,
			CanManagePosts: true,
			CanEditOthersPosts: true,
			CanManageRoles: false,
			CanManageInvites: false,
			CanManageTheme: false
		});

		await db.insert(Roles).values({
			Name: 'Member',
			Description: 'Regular chapter member',
			Type: 'MEMBER',
			CanManageUsers: false,
			CanManageEvents: false,
			CanManageGroups: false,
			CanManagePosts: false,
			CanEditOthersPosts: false,
			CanManageRoles: false,
			CanManageInvites: false,
			CanManageTheme: false
		});

		console.log('✅ Created default roles');

		// Create a default admin user
		console.log('Creating default admin user...');
		
		const hashedPassword = await hash('admin123'); // Change this password!
		
		const adminUser = await db.insert(Users).values({
			FirstName: 'UBSC',
			LastName: 'Administrator',
			Email: 'admin@ub.edu.bz',
			Username: 'admin',
			Password: hashedPassword,
			AccountType: 'owner',
			Administrator: true
		}).returning();

		// Assign admin role to admin user
		await db.insert(UserRoles).values({
			UserId: adminUser[0].Id,
			RoleId: adminRole[0].Id
		});

		console.log('✅ Created default admin user (admin@ub.edu.bz / admin123)');

		// Create initial invite codes
		console.log('Creating initial invite codes...');
		
		await db.insert(InviteCodes).values([
			{
				Code: 'UBSC2025',
				CreatedBy: adminUser[0].Id,
				MaxUses: 50,
				Description: 'Initial member recruitment - 2025',
				ExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
			},
			{
				Code: 'ADMIN001',
				CreatedBy: adminUser[0].Id,
				MaxUses: 5,
				Description: 'Admin user creation'
			}
		]);

		console.log('✅ Created initial invite codes (UBSC2025, ADMIN001)');

		console.log('🎉 Database seeded successfully!');
		console.log('');
		console.log('📋 Initial Setup:');
		console.log('   Admin Email: admin@ub.edu.bz');
		console.log('   Admin Password: admin123');
		console.log('   Invite Codes: UBSC2025 (50 uses), ADMIN001 (5 uses)');
		console.log('');
		console.log('⚠️  Remember to change the admin password in production!');

	} catch (error) {
		console.error('❌ Error seeding database:', error);
		process.exit(1);
	}
}

seed().then(() => {
	process.exit(0);
}).catch((error) => {
	console.error('❌ Seed script failed:', error);
	process.exit(1);
});
