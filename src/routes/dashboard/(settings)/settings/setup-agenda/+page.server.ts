import { DEBUG, IS_DEVELOPMENT } from '$env/static/private';
import { db } from '$lib/server/db';
import { Agenda, AgendaEvents } from '$lib/server/db/schema';
import { error, fail, type Actions, type ServerLoad } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import validator from 'validator';
import { z } from 'zod';

const agendaSchema__remove = z.object({
	agendaId: z.string().uuid()
});

const agendaSchema = z.object({
	title: z
		.string()
		.min(1, { message: 'The event name is too short.' })
		.max(255, { message: 'The event name is too long.' }),
	subtitle: z.string().max(255, { message: 'The subtitle is too short.' }).optional(),
	body: z.string().min(1, { message: 'The event description is too short.' }),
	startTime: z
		.string()
		.refine((str) => validator.isISO8601(str), { message: "That's not a valid date" }),
	endTime: z
		.string()
		.refine((str) => validator.isISO8601(str), { message: "That's not a valid date" })
});

const eventSchema = z.object({
	agendaId: z.string().uuid(),
	title: z.string().min(1).max(255),
	subtitle: z.string().max(255).optional(),
	body: z.string().min(1),
	speakerName: z.string().min(1).max(255),
	startTime: z
		.string()
		.refine((str) => validator.isISO8601(str), { message: "That's not a valid date" }),
	endTime: z
		.string()
		.refine((str) => validator.isISO8601(str), { message: "That's not a valid date" })
});

export const load: ServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
	const form = await superValidate(zod(agendaSchema));
	const removeAgendaForm = await superValidate(zod(agendaSchema__remove));
	const agendas = await db.query.Agenda.findMany({
		with: {
			events: true,
			groups: true
		},
		where: (agenda, { eq }) => eq(agenda.UserId, locals.user!.Id)
	});

	return { form, removeAgendaForm, agendas, user: locals.user, debug: DEBUG && IS_DEVELOPMENT };
};

export const actions: Actions = {
	addAgenda: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}
		const form = await superValidate(request, zod(agendaSchema));
		if (IS_DEVELOPMENT && DEBUG) {
			console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
			console.log('To disable this, set DEBUG to false in your .env file');
			console.log('form', form);
		}

		if (!form.valid) {
			setError(form, 'Invalid form data');
			return fail(400, { form });
		}

		const subtitle = form.data.subtitle
			? form.data.subtitle.trim() !== ''
				? form.data.subtitle.trim()
				: null
			: null;

		await db.insert(Agenda).values({
			Title: form.data.title,
			Subtitle: subtitle,
			Body: form.data.body,
			StartTime: new Date(form.data.startTime),
			EndTime: new Date(form.data.endTime),
			UserId: locals.user.Id
		});

		setMessage(form, 'Agenda created successfully');
		return { form };
	},

	addEvent: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}
		const form = await superValidate(request, zod(eventSchema));

		if (!form.valid) {
			setError(form, 'You have some errors in your form. Please fix them and try again.');
			return fail(400, { form });
		}

		// Verify agenda ownership
		const agenda = await db.query.Agenda.findFirst({
			where: (agenda, { eq }) => eq(agenda.Id, form.data.agendaId)
		});

		if (!agenda || agenda.UserId !== locals.user.Id) {
			throw error(403, 'Forbidden');
		}

		await db.insert(AgendaEvents).values(form.data);

		return { form };
	},

	deleteAgenda: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}
		const form = await superValidate(request, zod(agendaSchema__remove));
		if (IS_DEVELOPMENT && DEBUG) {
			console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
			console.log('To disable this, set DEBUG to false in your .env file');
			console.log('form', form);
		}

		if (!form.valid) {
			setError(form, 'Invalid form data');
			return fail(400, { form });
		}

		await db.delete(Agenda).where(eq(Agenda.Id, form.data.agendaId));

		setMessage(form, 'Agenda deleted successfully');
		return { removeAgendaForm: form };
	}
};
