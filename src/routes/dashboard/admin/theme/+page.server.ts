import { db } from '$lib/server/db';
import { ThemeSettings } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
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
        // Fetch current theme settings
        const currentTheme = await db
            .select()
            .from(ThemeSettings)
            .orderBy(desc(ThemeSettings.UpdatedAt))
            .limit(1);

        // Default theme if none exists
        const defaultTheme = {
            PrimaryColor: '#3B82F6',
            SecondaryColor: '#1E40AF',
            AccentColor: '#F59E0B',
            BackgroundColor: '#FFFFFF',
            TextColor: '#1F2937',
            IsActive: true
        };

        return {
            currentTheme: currentTheme.length > 0 ? currentTheme[0] : defaultTheme
        };
    } catch (error) {
        console.error('Error loading theme settings:', error);
        return {
            currentTheme: {
                PrimaryColor: '#3B82F6',
                SecondaryColor: '#1E40AF',
                AccentColor: '#F59E0B',
                BackgroundColor: '#FFFFFF',
                TextColor: '#1F2937',
                IsActive: true
            }
        };
    }
};
