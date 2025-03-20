import { DEBUG, IS_DEVELOPMENT } from '$env/static/private';
import { db } from '$lib/server/db';
import { Agenda, AgendaEvents } from '$lib/server/db/schema';
import { error, fail, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import validator from 'validator';
import { z } from 'zod';
import type { PageServerLoad } from './$types';

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

const eventSchema__remove = z.object({
	eventId: z.string().uuid()
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

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
	const form = await superValidate(zod(agendaSchema));
	const addEventForm = await superValidate(zod(eventSchema));
	const removeAgendaForm = await superValidate(zod(agendaSchema__remove));
	const removeEventForm = await superValidate(zod(eventSchema__remove));
	const agendas = await db.query.Agenda.findMany({
		with: {
			events: true,
			groups: true
		},
		where: (agenda, { eq }) => eq(agenda.UserId, locals.user!.Id)
	});
	return { form, addEventForm, removeAgendaForm, removeEventForm, agendas, user: locals.user, debug: Boolean(JSON.parse(DEBUG) && JSON.parse(IS_DEVELOPMENT)) };
};

export const actions: Actions = {
	addAgenda: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}
		const form = await superValidate(request, zod(agendaSchema));
		if (Boolean(JSON.parse(DEBUG) && JSON.parse(IS_DEVELOPMENT))) {
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
		if (Boolean(JSON.parse(DEBUG) && JSON.parse(IS_DEVELOPMENT))) {
			console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
			console.log('To disable this, set DEBUG to false in your .env file');
			console.log('form', form);
		}
		// Verify agenda ownership
		const agenda = await db.query.Agenda.findFirst({
			where: (agenda, { eq }) => eq(agenda.Id, form.data.agendaId)
		});

		if (!agenda || agenda.UserId !== locals.user.Id) {
			throw error(403, 'Forbidden');
		}

		const phonyEvent = {
			Title: form.data.title,
			Subtitle: form.data.subtitle,
			Body: form.data.body,
			SpeakerName: form.data.speakerName,
			StartTime: new Date(form.data.startTime),
			EndTime: new Date(form.data.endTime),
			AgendaId: form.data.agendaId
		};

		await db.insert(AgendaEvents).values(phonyEvent);

		return { addEventForm: form, phonyEvent };
	},

	deleteAgenda: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}
		const form = await superValidate(request, zod(agendaSchema__remove));
		if (Boolean(JSON.parse(DEBUG) && JSON.parse(IS_DEVELOPMENT))) {
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
	},

	deleteEvent: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}
		const form = await superValidate(request, zod(eventSchema__remove));
		if (Boolean(JSON.parse(DEBUG) && JSON.parse(IS_DEVELOPMENT))) {
			console.log('========== DEVELOPMENT MODE (DEBUG) ==========');
			console.log('To disable this, set DEBUG to false in your .env file');
			console.log('form', form);
		}

		if (!form.valid) {
			setError(form, 'Invalid form data');
			return fail(400, { form });
		}

		await db.delete(AgendaEvents).where(eq(AgendaEvents.Id, form.data.eventId));

		setMessage(form, 'Event deleted successfully');
		return { removeEventForm: form };
	}
};
