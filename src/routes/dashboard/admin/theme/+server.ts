import { db } from '$lib/server/db';
import { ThemeSettings } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { and, eq, ne } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    // Check if user has permission to manage theme
    if (!locals.user.Administrator && !locals.user.Permissions.CanManageTheme) {
        throw error(403, 'Forbidden');
    }

    try {
        const body = await request.json();
        const { action } = body;

        switch (action) {
            case 'save': {
                // Check if user already has a theme
                const existingUserTheme = await db
                    .select()
                    .from(ThemeSettings)
                    .where(and(
                        eq(ThemeSettings.CreatedBy, locals.user.Id),
                        eq(ThemeSettings.IsActive, true)
                    ))
                    .limit(1);

                const {
                    primaryColor,
                    secondaryColor,
                    accentColor,
                    backgroundColor,
                    textColor,
                    headerColor,
                    sidebarColor,
                    linkColor,
                    buttonColor,
                    successColor,
                    warningColor,
                    errorColor,
                    logoUrl,
                    faviconUrl,
                    customCss
                } = body;

                // Validate color format (basic hex validation)
                const colorFields = [
                    primaryColor, secondaryColor, accentColor, backgroundColor, textColor,
                    headerColor, sidebarColor, linkColor, buttonColor,
                    successColor, warningColor, errorColor
                ].filter(Boolean);

                const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                for (const color of colorFields) {
                    if (!hexRegex.test(color)) {
                        throw error(400, 'Invalid color format. Please use hex colors (e.g., #FF0000)');
                    }
                }

                let savedTheme;

                if (existingUserTheme.length > 0) {
                    // Update existing theme (user can only update their own)
                    [savedTheme] = await db
                        .update(ThemeSettings)
                        .set({
                            PrimaryColor: primaryColor || '#3B82F6',
                            SecondaryColor: secondaryColor || '#1E40AF',
                            AccentColor: accentColor || '#F59E0B',
                            BackgroundColor: backgroundColor || '#FFFFFF',
                            TextColor: textColor || '#1F2937',
                            HeaderColor: headerColor || '#1E40AF',
                            SidebarColor: sidebarColor || '#F3F4F6',
                            LinkColor: linkColor || '#3B82F6',
                            ButtonColor: buttonColor || '#3B82F6',
                            SuccessColor: successColor || '#10B981',
                            WarningColor: warningColor || '#F59E0B',
                            ErrorColor: errorColor || '#EF4444',
                            LogoUrl: logoUrl || null,
                            FaviconUrl: faviconUrl || null,
                            CustomCss: customCss || null,
                            UpdatedBy: locals.user.Id,
                            UpdatedAt: new Date()
                        })
                        .where(eq(ThemeSettings.Id, existingUserTheme[0].Id))
                        .returning();
                } else {
                    // Create new theme - each admin can only create one
                    [savedTheme] = await db
                        .insert(ThemeSettings)
                        .values({
                            PrimaryColor: primaryColor || '#3B82F6',
                            SecondaryColor: secondaryColor || '#1E40AF',
                            AccentColor: accentColor || '#F59E0B',
                            BackgroundColor: backgroundColor || '#FFFFFF',
                            TextColor: textColor || '#1F2937',
                            HeaderColor: headerColor || '#1E40AF',
                            SidebarColor: sidebarColor || '#F3F4F6',
                            LinkColor: linkColor || '#3B82F6',
                            ButtonColor: buttonColor || '#3B82F6',
                            SuccessColor: successColor || '#10B981',
                            WarningColor: warningColor || '#F59E0B',
                            ErrorColor: errorColor || '#EF4444',
                            LogoUrl: logoUrl || null,
                            FaviconUrl: faviconUrl || null,
                            CustomCss: customCss || null,
                            Selected: false,
                            IsActive: true,
                            CreatedBy: locals.user.Id,
                            UpdatedBy: locals.user.Id
                        })
                        .returning();
                }

                return json({ success: true, theme: savedTheme });
            }

            case 'select': {
                const { themeId } = body;

                if (!themeId) {
                    throw error(400, 'Theme ID is required');
                }

                // Verify the theme exists and is active
                const themeToSelect = await db
                    .select()
                    .from(ThemeSettings)
                    .where(and(
                        eq(ThemeSettings.Id, themeId),
                        eq(ThemeSettings.IsActive, true)
                    ))
                    .limit(1);

                if (themeToSelect.length === 0) {
                    throw error(404, 'Theme not found');
                }

                // Set all other themes to selected = false
                await db
                    .update(ThemeSettings)
                    .set({ Selected: false })
                    .where(ne(ThemeSettings.Id, themeId));

                // Set the selected theme to selected = true
                const [selectedTheme] = await db
                    .update(ThemeSettings)
                    .set({ Selected: true })
                    .where(eq(ThemeSettings.Id, themeId))
                    .returning();

                return json({ success: true, theme: selectedTheme });
            }

            case 'delete': {
                const { themeId } = body;

                if (!themeId) {
                    throw error(400, 'Theme ID is required');
                }

                // Verify the theme exists and belongs to the current user
                const themeToDelete = await db
                    .select()
                    .from(ThemeSettings)
                    .where(and(
                        eq(ThemeSettings.Id, themeId),
                        eq(ThemeSettings.CreatedBy, locals.user.Id)
                    ))
                    .limit(1);

                if (themeToDelete.length === 0) {
                    throw error(404, 'Theme not found or you do not have permission to delete it');
                }

                // Soft delete by setting IsActive to false
                await db
                    .update(ThemeSettings)
                    .set({ IsActive: false })
                    .where(eq(ThemeSettings.Id, themeId));

                return json({ success: true });
            }

            default:
                throw error(400, 'Invalid action');
        }
    } catch (err) {
        console.error('Theme management error:', err);
        if (err instanceof Error) {
            throw error(500, err.message);
        }
        throw error(500, 'Internal server error');
    }
};
