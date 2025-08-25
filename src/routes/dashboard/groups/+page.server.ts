import { db } from '$lib/server/db';
import { GroupMembers, Groups, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { count, desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    try {
        // Fetch all groups with member counts
        const allGroups = await db
            .select({
                id: Groups.Id,
                title: Groups.Title,
                description: Groups.Description,
                type: Groups.Type,
                isActive: Groups.IsActive,
                createdAt: Groups.CreatedAt,
                createdBy: Groups.CreatedBy,
                creatorName: Users.FirstName,
                creatorLastName: Users.LastName
            })
            .from(Groups)
            .leftJoin(Users, eq(Groups.CreatedBy, Users.Id))
            .orderBy(desc(Groups.CreatedAt));

        // Get member counts for each group
        const groupIds = allGroups.map(group => group.id);
        const memberCounts = groupIds.length > 0 ? await db
            .select({
                groupId: GroupMembers.GroupId,
                count: count()
            })
            .from(GroupMembers)
            .where(eq(GroupMembers.GroupId, GroupMembers.GroupId))
            .groupBy(GroupMembers.GroupId) : [];

        // Create a map of member counts
        const memberCountMap = new Map();
        for (const countResult of memberCounts) {
            memberCountMap.set(countResult.groupId, countResult.count);
        }

        // Add member counts to groups
        const groupsWithCounts = allGroups.map(group => ({
            ...group,
            name: group.title,
            memberCount: memberCountMap.get(group.id) || 0
        }));

        // Fetch all users for member assignment
        const availableUsers = await db
            .select({
                id: Users.Id,
                firstName: Users.FirstName,
                lastName: Users.LastName,
                email: Users.Email,
                username: Users.Username
            })
            .from(Users)
            .orderBy(Users.FirstName, Users.LastName);

        return {
            groups: groupsWithCounts,
            availableUsers
        };
    } catch (error) {
        console.error('Error loading groups:', error);
        return {
            groups: [],
            availableUsers: []
        };
    }
};
