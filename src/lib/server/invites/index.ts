import { db } from '../db';
import { InviteCodes, InviteCodeUsage, Users } from '../db/schema';
import { eq, and, desc, count } from 'drizzle-orm';

export interface CreateInviteData {
	createdBy: string;
	maxUses?: number;
	expiresAt?: Date;
	description?: string;
}

export interface InviteStats {
	code: string;
	id: string;
	description?: string | null;
	maxUses: number;
	currentUses: number;
	remainingUses: number;
	isActive: boolean;
	expiresAt?: string;
	createdAt: string;
	createdBy: {
		id: string;
		username: string;
		firstName: string;
		lastName: string;
	};
	usages: {
		userId: string;
		username: string;
		firstName: string;
		lastName: string;
		usedAt: string;
	}[];
}

export class InviteService {
	/**
	 * Generate a new invite code
	 */
	static generateInviteCode(): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for (let i = 0; i < 8; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	/**
	 * Create a new invite code
	 */
	static async createInvite(inviteData: CreateInviteData): Promise<{ success: boolean; code?: string; error?: string }> {
		try {
			const code = this.generateInviteCode();
			
			// Ensure the code is unique
			const existingCode = await db
				.select()
				.from(InviteCodes)
				.where(eq(InviteCodes.Code, code))
				.limit(1);

			if (existingCode.length > 0) {
				// Try again with a new code
				return this.createInvite(inviteData);
			}

			await db.insert(InviteCodes).values({
				Code: code,
				CreatedBy: inviteData.createdBy,
				MaxUses: inviteData.maxUses || 1,
				ExpiresAt: inviteData.expiresAt,
				Description: inviteData.description
			});

			return { success: true, code };
		} catch (error) {
			console.error('Error creating invite:', error);
			return { success: false, error: 'Failed to create invite code' };
		}
	}

	/**
	 * Validate an invite code
	 */
	static async validateInvite(code: string): Promise<{ valid: boolean; error?: string }> {
		try {
			const inviteResult = await db
				.select()
				.from(InviteCodes)
				.where(
					and(
						eq(InviteCodes.Code, code),
						eq(InviteCodes.IsActive, true)
					)
				)
				.limit(1);

			if (inviteResult.length === 0) {
				return { valid: false, error: 'Invalid or inactive invite code' };
			}

			const invite = inviteResult[0];

			if (invite.CurrentUses >= invite.MaxUses) {
				return { valid: false, error: 'Invite code has reached maximum uses' };
			}

			if (invite.ExpiresAt && new Date() > new Date(invite.ExpiresAt)) {
				return { valid: false, error: 'Invite code has expired' };
			}

			return { valid: true };
		} catch (error) {
			console.error('Error validating invite:', error);
			return { valid: false, error: 'Error validating invite code' };
		}
	}

	/**
	 * Get all invite codes with statistics
	 */
	static async getInviteStats(): Promise<{ success: boolean; invites?: InviteStats[]; error?: string }> {
		try {
			const invites = await db
				.select({
					id: InviteCodes.Id,
					code: InviteCodes.Code,
					description: InviteCodes.Description,
					maxUses: InviteCodes.MaxUses,
					currentUses: InviteCodes.CurrentUses,
					isActive: InviteCodes.IsActive,
					expiresAt: InviteCodes.ExpiresAt,
					createdAt: InviteCodes.CreatedAt,
					createdBy: {
						id: Users.Id,
						username: Users.Username,
						firstName: Users.FirstName,
						lastName: Users.LastName
					}
				})
				.from(InviteCodes)
				.innerJoin(Users, eq(InviteCodes.CreatedBy, Users.Id))
				.orderBy(desc(InviteCodes.CreatedAt));

			const inviteStats: InviteStats[] = [];

			for (const invite of invites) {
				// Get usage details for each invite
				const usages = await db
					.select({
						userId: Users.Id,
						username: Users.Username,
						firstName: Users.FirstName,
						lastName: Users.LastName,
						usedAt: InviteCodeUsage.UsedAt
					})
					.from(InviteCodeUsage)
					.innerJoin(Users, eq(InviteCodeUsage.UserId, Users.Id))
					.where(eq(InviteCodeUsage.InviteCodeId, invite.id))
					.orderBy(desc(InviteCodeUsage.UsedAt));

				inviteStats.push({
					...invite,
					remainingUses: invite.maxUses - invite.currentUses,
					expiresAt: invite.expiresAt?.toISOString(),
					createdAt: invite.createdAt.toISOString(),
					usages: usages.map(usage => ({
						...usage,
						usedAt: usage.usedAt.toISOString()
					}))
				});
			}

			return { success: true, invites: inviteStats };
		} catch (error) {
			console.error('Error getting invite stats:', error);
			return { success: false, error: 'Failed to get invite statistics' };
		}
	}

	/**
	 * Deactivate an invite code
	 */
	static async deactivateInvite(inviteId: string): Promise<{ success: boolean; error?: string }> {
		try {
			await db
				.update(InviteCodes)
				.set({ IsActive: false })
				.where(eq(InviteCodes.Id, inviteId));

			return { success: true };
		} catch (error) {
			console.error('Error deactivating invite:', error);
			return { success: false, error: 'Failed to deactivate invite code' };
		}
	}

	/**
	 * Reactivate an invite code
	 */
	static async reactivateInvite(inviteId: string): Promise<{ success: boolean; error?: string }> {
		try {
			await db
				.update(InviteCodes)
				.set({ IsActive: true })
				.where(eq(InviteCodes.Id, inviteId));

			return { success: true };
		} catch (error) {
			console.error('Error reactivating invite:', error);
			return { success: false, error: 'Failed to reactivate invite code' };
		}
	}

	/**
	 * Delete an invite code
	 */
	static async deleteInvite(inviteId: string): Promise<{ success: boolean; error?: string }> {
		try {
			await db
				.delete(InviteCodes)
				.where(eq(InviteCodes.Id, inviteId));

			return { success: true };
		} catch (error) {
			console.error('Error deleting invite:', error);
			return { success: false, error: 'Failed to delete invite code' };
		}
	}

	/**
	 * Get usage statistics
	 */
	static async getUsageStats(): Promise<{ 
		success: boolean; 
		stats?: {
			totalInvites: number;
			activeInvites: number;
			totalSignups: number;
			recentSignups: number;
		}; 
		error?: string 
	}> {
		try {
			const totalInvites = await db
				.select({ count: count() })
				.from(InviteCodes);

			const activeInvites = await db
				.select({ count: count() })
				.from(InviteCodes)
				.where(eq(InviteCodes.IsActive, true));

			const totalSignups = await db
				.select({ count: count() })
				.from(InviteCodeUsage);

			const recentSignups = await db
				.select({ count: count() })
				.from(InviteCodeUsage);
				// For now, recent signups equals total signups

			return {
				success: true,
				stats: {
					totalInvites: totalInvites[0].count,
					activeInvites: activeInvites[0].count,
					totalSignups: totalSignups[0].count,
					recentSignups: recentSignups[0].count
				}
			};
		} catch (error) {
			console.error('Error getting usage stats:', error);
			return { success: false, error: 'Failed to get usage statistics' };
		}
	}
}
