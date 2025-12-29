import { db } from '$lib/server/db';
import { ThemeSettings, Users } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/auth/login');
    }

    // Check if user has permission to manage theme
    if (!locals.user.Administrator && !locals.user.Permissions.CanManageTheme) {
        throw redirect(302, '/dashboard');
    }

    try {
        // Fetch all themes with creator information
        const allThemes = await db
            .select({
                id: ThemeSettings.Id,
                primaryColor: ThemeSettings.PrimaryColor,
                secondaryColor: ThemeSettings.SecondaryColor,
                accentColor: ThemeSettings.AccentColor,
                backgroundColor: ThemeSettings.BackgroundColor,
                textColor: ThemeSettings.TextColor,
                headerColor: ThemeSettings.HeaderColor,
                sidebarColor: ThemeSettings.SidebarColor,
                linkColor: ThemeSettings.LinkColor,
                buttonColor: ThemeSettings.ButtonColor,
                successColor: ThemeSettings.SuccessColor,
                warningColor: ThemeSettings.WarningColor,
                errorColor: ThemeSettings.ErrorColor,
                logoUrl: ThemeSettings.LogoUrl,
                faviconUrl: ThemeSettings.FaviconUrl,
                customCss: ThemeSettings.CustomCss,
                selected: ThemeSettings.Selected,
                isActive: ThemeSettings.IsActive,
                createdBy: ThemeSettings.CreatedBy,
                createdAt: ThemeSettings.CreatedAt,
                updatedAt: ThemeSettings.UpdatedAt,
                creatorFirstName: Users.FirstName,
                creatorLastName: Users.LastName,
                creatorUsername: Users.Username
            })
            .from(ThemeSettings)
            .leftJoin(Users, eq(ThemeSettings.CreatedBy, Users.Id))
            .where(eq(ThemeSettings.IsActive, true));

        // Check if the current user already has a theme
        const userTheme = allThemes.find(theme => theme.createdBy === locals.user!.Id);

        // Find the currently selected theme
        const selectedTheme = allThemes.find(theme => theme.selected);

        return {
            themes: allThemes,
            userTheme: userTheme || null,
            selectedTheme: selectedTheme || null,
            currentUserId: locals.user.Id
        };
    } catch (error) {
        console.error('Error loading theme settings:', error);
        return {
            themes: [],
            userTheme: null,
            selectedTheme: null,
            currentUserId: locals.user.Id
        };
    }
};
