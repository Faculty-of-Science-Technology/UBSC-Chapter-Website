import { db } from '$lib/server/db';
import { ThemeSettings } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
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
                const {
                    primaryColor,
                    secondaryColor,
                    accentColor,
                    backgroundColor,
                    textColor
                } = body;

                // Validate color format (basic hex validation)
                const colorFields = [
                    primaryColor, secondaryColor, accentColor, backgroundColor, textColor
                ].filter(Boolean);

                const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
                for (const color of colorFields) {
                    if (!hexRegex.test(color)) {
                        throw error(400, 'Invalid color format. Please use hex colors (e.g., #FF0000)');
                    }
                }

                // Check if there's an existing active theme
                const existingTheme = await db
                    .select()
                    .from(ThemeSettings)
                    .where(eq(ThemeSettings.IsActive, true))
                    .limit(1);

                let savedTheme;

                if (existingTheme.length > 0) {
                    // Update existing theme
                    [savedTheme] = await db
                        .update(ThemeSettings)
                        .set({
                            PrimaryColor: primaryColor || '#3B82F6',
                            SecondaryColor: secondaryColor || '#1E40AF',
                            AccentColor: accentColor || '#F59E0B',
                            BackgroundColor: backgroundColor || '#FFFFFF',
                            TextColor: textColor || '#1F2937',
                            UpdatedBy: locals.user.Id,
                            UpdatedAt: new Date()
                        })
                        .where(eq(ThemeSettings.Id, existingTheme[0].Id))
                        .returning();
                } else {
                    // Create new theme
                    [savedTheme] = await db
                        .insert(ThemeSettings)
                        .values({
                            PrimaryColor: primaryColor || '#3B82F6',
                            SecondaryColor: secondaryColor || '#1E40AF',
                            AccentColor: accentColor || '#F59E0B',
                            BackgroundColor: backgroundColor || '#FFFFFF',
                            TextColor: textColor || '#1F2937',
                            IsActive: true,
                            UpdatedBy: locals.user.Id
                        })
                        .returning();
                }

                return json({ success: true, theme: savedTheme });
            }

            case 'reset': {
                // Check if there's an existing active theme
                const existingTheme = await db
                    .select()
                    .from(ThemeSettings)
                    .where(eq(ThemeSettings.IsActive, true))
                    .limit(1);

                let resetTheme;

                if (existingTheme.length > 0) {
                    // Update existing theme with defaults
                    [resetTheme] = await db
                        .update(ThemeSettings)
                        .set({
                            PrimaryColor: '#3B82F6',
                            SecondaryColor: '#1E40AF',
                            AccentColor: '#F59E0B',
                            BackgroundColor: '#FFFFFF',
                            TextColor: '#1F2937',
                            UpdatedBy: locals.user.Id,
                            UpdatedAt: new Date()
                        })
                        .where(eq(ThemeSettings.Id, existingTheme[0].Id))
                        .returning();
                } else {
                    // Create new default theme
                    [resetTheme] = await db
                        .insert(ThemeSettings)
                        .values({
                            PrimaryColor: '#3B82F6',
                            SecondaryColor: '#1E40AF',
                            AccentColor: '#F59E0B',
                            BackgroundColor: '#FFFFFF',
                            TextColor: '#1F2937',
                            IsActive: true,
                            UpdatedBy: locals.user.Id
                        })
                        .returning();
                }

                return json({ success: true, theme: resetTheme });
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
