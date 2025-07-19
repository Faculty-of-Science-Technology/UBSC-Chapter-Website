import { JWT_SECRET } from '$env/static/private';
import { hash, verify } from 'argon2';
import { and, eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { InviteCodes, InviteCodeUsage, Roles, UserRoles, Users } from '../db/schema';

export interface CreateUserData {
	firstName: string;
	lastName: string;
	email: string;
	username: string;
	password: string;
	phone?: string;
	inviteCode: string;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface UserPermissions {
	CanManageUsers: boolean;
	CanManageEvents: boolean;
	CanManageGroups: boolean;
	CanManagePosts: boolean;
	CanEditOthersPosts: boolean;
	CanManageRoles: boolean;
	CanManageInvites: boolean;
	CanManageTheme: boolean;
}

export interface UserSession {
    Id: string;
	Email: string;
	Username: string;
	FirstName: string;
	LastName: string;
	AccountType: string;
	Administrator: boolean;
	Roles: string[];
	Permissions: UserPermissions;
}

export class AuthService {
	/**
	 * Register a new user with invite code validation
	 */
	static async registerUser(userData: CreateUserData): Promise<{ success: boolean; error?: string; userId?: string }> {
		try {
			// Validate invite code
			const inviteCodeResult = await db
				.select()
				.from(InviteCodes)
				.where(
					and(
						eq(InviteCodes.Code, userData.inviteCode),
						eq(InviteCodes.IsActive, true)
					)
				)
				.limit(1);

			if (inviteCodeResult.length === 0) {
				return { success: false, error: 'Invalid or inactive invite code' };
			}

			const inviteCode = inviteCodeResult[0];

			// Check if invite code has reached max uses
			if (inviteCode.CurrentUses >= inviteCode.MaxUses) {
				return { success: false, error: 'Invite code has reached maximum uses' };
			}

			// Check if invite code has expired
			if (inviteCode.ExpiresAt && new Date() > new Date(inviteCode.ExpiresAt)) {
				return { success: false, error: 'Invite code has expired' };
			}

			// Check if email or username already exists
			const existingUser = await db
				.select()
				.from(Users)
				.where(
					eq(Users.Email, userData.email)
				)
				.limit(1);

			if (existingUser.length > 0) {
				return { success: false, error: 'Email already registered' };
			}

			const existingUsername = await db
				.select()
				.from(Users)
				.where(
					eq(Users.Username, userData.username)
				)
				.limit(1);

			if (existingUsername.length > 0) {
				return { success: false, error: 'Username already taken' };
			}

			// Hash password
			const hashedPassword = await hash(userData.password);

			// Create user
			const newUserId = uuidv4();
			await db.insert(Users).values({
				Id: newUserId,
				FirstName: userData.firstName,
				LastName: userData.lastName,
				Email: userData.email,
				Username: userData.username,
				Password: hashedPassword,
				Phone: userData.phone,
				AccountType: 'student', // Default to student
				InviteCodeUsed: userData.inviteCode
			});

			// Record invite code usage
			await db.insert(InviteCodeUsage).values({
				InviteCodeId: inviteCode.Id,
				UserId: newUserId
			});

			// Update invite code usage count
			await db
				.update(InviteCodes)
				.set({
					CurrentUses: inviteCode.CurrentUses + 1
				})
				.where(eq(InviteCodes.Id, inviteCode.Id));

			// Assign default member role
			const defaultRole = await db
				.select()
				.from(Roles)
				.where(eq(Roles.Type, 'MEMBER'))
				.limit(1);

			if (defaultRole.length > 0) {
				await db.insert(UserRoles).values({
					UserId: newUserId,
					RoleId: defaultRole[0].Id
				});
			}

			return { success: true, userId: newUserId };
		} catch (error) {
			console.error('Registration error:', error);
			return { success: false, error: 'Registration failed' };
		}
	}

	/**
	 * Authenticate user login
	 */
	static async loginUser(loginData: LoginData): Promise<{ success: boolean; error?: string; user?: UserSession; token?: string }> {
		try {
			// Find user by email
			const userResult = await db
				.select()
				.from(Users)
				.where(eq(Users.Email, loginData.email))
				.limit(1);

			if (userResult.length === 0) {
				return { success: false, error: 'Invalid email or password' };
			}

			const user = userResult[0];

			// Verify password
			const isValidPassword = await verify(user.Password, loginData.password);
			if (!isValidPassword) {
				return { success: false, error: 'Invalid email or password' };
			}

			// Get user roles and permissions
			const userRoles = await db
				.select({
					roleName: Roles.Name,
					roleType: Roles.Type,
					canManageUsers: Roles.CanManageUsers,
					canManageEvents: Roles.CanManageEvents,
					canManageGroups: Roles.CanManageGroups,
					canManagePosts: Roles.CanManagePosts,
					canEditOthersPosts: Roles.CanEditOthersPosts,
					canManageRoles: Roles.CanManageRoles,
					canManageInvites: Roles.CanManageInvites,
					canManageTheme: Roles.CanManageTheme
				})
				.from(UserRoles)
				.innerJoin(Roles, eq(UserRoles.RoleId, Roles.Id))
				.where(eq(UserRoles.UserId, user.Id));

			// Aggregate permissions
			const permissions = {
				CanManageUsers: userRoles.some(r => r.canManageUsers) || user.Administrator,
				CanManageEvents: userRoles.some(r => r.canManageEvents) || user.Administrator,
				CanManageGroups: userRoles.some(r => r.canManageGroups) || user.Administrator,
				CanManagePosts: userRoles.some(r => r.canManagePosts) || user.Administrator,
				CanEditOthersPosts: userRoles.some(r => r.canEditOthersPosts) || user.Administrator,
				CanManageRoles: userRoles.some(r => r.canManageRoles) || user.Administrator,
				CanManageInvites: userRoles.some(r => r.canManageInvites) || user.Administrator,
				CanManageTheme: userRoles.some(r => r.canManageTheme) || user.Administrator
			};

			const userSession: UserSession = {
				Id: user.Id,
				Email: user.Email,
				Username: user.Username,
				FirstName: user.FirstName,
				LastName: user.LastName,
				AccountType: user.AccountType,
				Administrator: user.Administrator,
				Roles: userRoles.map(r => r.roleName),
				Permissions: permissions
			};

			// Generate JWT token
			const token = jwt.sign(
				{
					userId: user.Id,
					email: user.Email,
					permissions
				},
				JWT_SECRET,
				{ expiresIn: '7d' }
			);

			return { success: true, user: userSession, token };
		} catch (error) {
			console.error('Login error:', error);
			return { success: false, error: 'Login failed' };
		}
	}

	/**
	 * Verify JWT token and return user session
	 */
	static async verifyToken(token: string): Promise<{ success: boolean; user?: UserSession; error?: string }> {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; permissions: UserPermissions };
			
			// Get fresh user data
			const userResult = await db
				.select()
				.from(Users)
				.where(eq(Users.Id, decoded.userId))
				.limit(1);

			if (userResult.length === 0) {
				return { success: false, error: 'User not found' };
			}

			const user = userResult[0];

			// Get user roles and permissions
			const userRoles = await db
				.select({
					roleName: Roles.Name,
					roleType: Roles.Type,
					canManageUsers: Roles.CanManageUsers,
					canManageEvents: Roles.CanManageEvents,
					canManageGroups: Roles.CanManageGroups,
					canManagePosts: Roles.CanManagePosts,
					canEditOthersPosts: Roles.CanEditOthersPosts,
					canManageRoles: Roles.CanManageRoles,
					canManageInvites: Roles.CanManageInvites,
					canManageTheme: Roles.CanManageTheme
				})
				.from(UserRoles)
				.innerJoin(Roles, eq(UserRoles.RoleId, Roles.Id))
				.where(eq(UserRoles.UserId, user.Id));

			// Aggregate permissions
			const permissions = {
				canManageUsers: userRoles.some(r => r.canManageUsers) || user.Administrator,
				canManageEvents: userRoles.some(r => r.canManageEvents) || user.Administrator,
				canManageGroups: userRoles.some(r => r.canManageGroups) || user.Administrator,
				canManagePosts: userRoles.some(r => r.canManagePosts) || user.Administrator,
				canEditOthersPosts: userRoles.some(r => r.canEditOthersPosts) || user.Administrator,
				canManageRoles: userRoles.some(r => r.canManageRoles) || user.Administrator,
				canManageInvites: userRoles.some(r => r.canManageInvites) || user.Administrator,
				canManageTheme: userRoles.some(r => r.canManageTheme) || user.Administrator
			};

			const userSession: UserSession = {
				id: user.Id,
				email: user.Email,
				username: user.Username,
				firstName: user.FirstName,
				lastName: user.LastName,
				accountType: user.AccountType,
				administrator: user.Administrator,
				roles: userRoles.map(r => r.roleName),
				permissions
			};

			return { success: true, user: userSession };
		} catch (error) {
			console.error('Token verification error:', error);
			return { success: false, error: 'Invalid token' };
		}
	}
}
