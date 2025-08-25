import { db } from '$lib/server/db';
import { GroupMembers, Groups, Roles, UserRoles, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    try {
        // Fetch all members with their roles and groups
        const membersData = await db
            .select({
                id: Users.Id,
                email: Users.Email,
                username: Users.Username,
                firstName: Users.FirstName,
                lastName: Users.LastName,
                administrator: Users.Administrator,
                accountType: Users.AccountType,
                phone: Users.Phone,
                location: Users.Location,
                profilePicture: Users.ProfilePicture,
                bio: Users.Bio,
                hidden: Users.Hidden,
                createdAt: Users.CreatedAt,
                roleId: UserRoles.RoleId,
                roleName: Roles.Name,
                roleType: Roles.Type,
                roleColor: Roles.Color
            })
            .from(Users)
            .leftJoin(UserRoles, eq(Users.Id, UserRoles.UserId))
            .leftJoin(Roles, eq(UserRoles.RoleId, Roles.Id))
            .orderBy(desc(Users.CreatedAt));

        // Group members by their ID and aggregate roles
        const memberMap = new Map();
        
        membersData.forEach(member => {
            if (!memberMap.has(member.id)) {
                memberMap.set(member.id, {
                    id: member.id,
                    email: member.email,
                    username: member.username,
                    firstName: member.firstName,
                    lastName: member.lastName,
                    administrator: member.administrator,
                    accountType: member.accountType,
                    phone: member.phone,
                    location: member.location,
                    profilePicture: member.profilePicture,
                    bio: member.bio,
                    hidden: member.hidden,
                    createdAt: member.createdAt,
                    roles: []
                });
            }
            
            if (member.roleId) {
                memberMap.get(member.id).roles.push({
                    id: member.roleId,
                    name: member.roleName,
                    type: member.roleType,
                    color: member.roleColor || '#6366f1'
                });
            }
        });

        const members = Array.from(memberMap.values());

        // Fetch member groups
        const memberGroups = await db
            .select({
                userId: GroupMembers.UserId,
                groupId: Groups.Id,
                groupTitle: Groups.Title,
                groupType: Groups.Type,
                joinedAt: GroupMembers.CreatedAt
            })
            .from(GroupMembers)
            .leftJoin(Groups, eq(GroupMembers.GroupId, Groups.Id));

        // Add groups to members
        const memberGroupMap = new Map();
        memberGroups.forEach(mg => {
            if (!memberGroupMap.has(mg.userId)) {
                memberGroupMap.set(mg.userId, []);
            }
            memberGroupMap.get(mg.userId).push({
                id: mg.groupId,
                name: mg.groupTitle,
                type: mg.groupType,
                joinedAt: mg.joinedAt
            });
        });

        members.forEach(member => {
            member.groups = memberGroupMap.get(member.id) || [];
            member.emailVerified = !member.hidden; // Use hidden status as email verification proxy
        });

        // Calculate member statistics
        const totalMembers = members.length;
        const verifiedMembers = members.filter(m => !m.hidden).length; // Using hidden status instead of emailVerified
        const adminMembers = members.filter(m => m.administrator).length;
        const recentMembers = members.filter(m => {
            const joinDate = new Date(m.createdAt);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return joinDate > thirtyDaysAgo;
        }).length;

        // Fetch all available groups for filtering
        const availableGroups = await db
            .select({
                id: Groups.Id,
                name: Groups.Title,
                type: Groups.Type
            })
            .from(Groups)
            .orderBy(Groups.Title);

        // Fetch all available roles for filtering
        const availableRoles = await db
            .select({
                id: Roles.Id,
                name: Roles.Name,
                type: Roles.Type,
                color: Roles.Color
            })
            .from(Roles)
            .orderBy(Roles.Name);

        return {
            members,
            stats: {
                totalMembers,
                verifiedMembers,
                adminMembers,
                recentMembers
            },
            availableGroups,
            availableRoles
        };
    } catch (error) {
        console.error('Error loading members:', error);
        return {
            members: [],
            stats: {
                totalMembers: 0,
                verifiedMembers: 0,
                adminMembers: 0,
                recentMembers: 0
            },
            availableGroups: [],
            availableRoles: []
        };
    }
};
