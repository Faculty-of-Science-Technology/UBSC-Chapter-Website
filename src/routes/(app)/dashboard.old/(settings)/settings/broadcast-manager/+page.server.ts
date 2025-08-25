import { DEBUG, IS_DEVELOPMENT } from '$env/static/private';
import { broadcastEmail } from '$lib/email';
import { getUserEmails } from '$lib/server/db/users';
import { error, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, setMessage } from 'sveltekit-superforms/server';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';

// Define broadcast email schema
const broadcastSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(255, 'Subject must be 255 characters or less'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(10000, 'Message must be 10,000 characters or less')
});

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw error(401, '✗ Unauthorized');
    }

    // Only owners and administrators can access this page
    if (locals.user.AccountType !== 'owner' && !locals.user.Administrator) {
        throw redirect(301, '/dashboard');
    }

    // Get count of recipients for informational purposes
    const recipientEmails = await getUserEmails();
    const recipientCount = recipientEmails?.length || 0;

    const form = await superValidate(zod(broadcastSchema));
    return {
        form,
        recipientCount,
        user: locals.user,
        debug: Boolean(JSON.parse(DEBUG) ?? JSON.parse(IS_DEVELOPMENT)) 
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, '✗ Unauthorized');
        }

        // Only owners and administrators can send broadcast emails
        if (locals.user.AccountType !== 'owner' && !locals.user.Administrator) {
            throw error(403, 'Forbidden');
        }

        const form = await superValidate(request, zod(broadcastSchema));

        if (Boolean(JSON.parse(DEBUG) ?? JSON.parse(IS_DEVELOPMENT))) {
            console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
            console.log('To disable this, set DEBUG to false in your .env file');
            console.log('form', form);
        }

        if (!form.valid) {
            setError(form, '', 'You have some errors in your form. Please fix them and try again.');
            return fail(400, { form });
        }

        try {
            // Send broadcast email to all users
            await broadcastEmail({
                subject: form.data.subject,
                body: form.data.message,
                bcc: true // Use BCC for privacy
            });

            setMessage(form, '✓ Broadcast email sent successfully');
            return { form };
        } catch (error) {
            console.error('Failed to send broadcast email:', error);
            setError(form, '', 'Failed to send broadcast email. Please try again later.');
            return fail(500, { form });
        }
    }
};
