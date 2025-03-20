import { DEBUG, IS_DEVELOPMENT } from '$env/static/private';
import { db } from '$lib/server/db';
import { GroupMembers, Groups } from '$lib/server/db/schema';
import { error, fail, type Actions } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { PageServerLoad } from '../$types';

const groupSchema = z.object({
    title: z.string().min(1, { message: 'Group name is required' }).max(255),
    agendaId: z.string().uuid()
});

const memberSchema = z.object({
    groupId: z.string().uuid(),
    userId: z.string().uuid()
});

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    // console.log(params);
    // @ts-expect-error Weird error
    const agendaId = params.agendaID;
    if (!agendaId) throw error(400, 'Agenda ID is required');

    const agenda = await db.query.Agenda.findFirst({
        where: (agenda, { eq }) => eq(agenda.Id, agendaId)
    });
    if (!agenda) throw error(404, 'Agenda not found');

    const groups = await db.query.Groups.findMany({
        with: {
            members: {
                with: {
                    user: true
                }
            }
        },
        where: (group, { eq }) => eq(group.AgendaId, agendaId)
    });

    const availableUsers = await db.query.Users.findMany({
       // where: (user, { eq }) => eq(user., true)
    });

    const form = await superValidate(zod(groupSchema));
    const memberForm = await superValidate(zod(memberSchema));

    return { 
        agenda, 
        groups, 
        availableUsers, 
        form, 
        memberForm,
        debug: DEBUG && IS_DEVELOPMENT 
    };
};

export const actions: Actions = {
    createGroup: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const form = await superValidate(request, zod(groupSchema));

        if (IS_DEVELOPMENT && DEBUG) {
            console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
            console.log('form', form);
        }

        if (!form.valid) {
            setError(form, 'Invalid form data');
            return fail(400, { form });
        }

        await db.insert(Groups).values({
            Title: form.data.title,
            AgendaId: form.data.agendaId
        });

        setMessage(form, 'Group created successfully');
        return { form };
    },

    addMember: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const form = await superValidate(request, zod(memberSchema));

        if (!form.valid) {
            setError(form, 'Invalid form data');
            return fail(400, { form });
        }

        await db.insert(GroupMembers).values({
            GroupId: form.data.groupId,
            UserId: form.data.userId
        });

        setMessage(form, 'Member added successfully');
        return { memberForm: form };
    },

    removeMember: async ({ request, locals }) => {
        if (!locals.user) {
            throw error(401, 'Unauthorized');
        }

        const form = await superValidate(request, zod(memberSchema));

        if (!form.valid) {
            setError(form, 'Invalid form data');
            return fail(400, { form });
        }

        await db.delete(GroupMembers)
            .where(and(eq(GroupMembers.GroupId, form.data.groupId), eq(GroupMembers.UserId, form.data.userId)));

        setMessage(form, 'Member removed successfully');
        return { memberForm: form };
    }
};
