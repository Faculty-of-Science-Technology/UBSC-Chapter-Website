<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Dialog from '$lib/components/vendor/ui/dialog';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import { ScrollArea } from '$lib/components/vendor/ui/scroll-area/index.js';
	import * as Sheet from '$lib/components/vendor/ui/sheet';
	import * as Table from '$lib/components/vendor/ui/table';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import { Calendar, Clock, Pencil, Plus, Trash2, Users } from 'lucide-svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import { type PageProps } from './$types.js';

	const { data }: PageProps = $props();
	const user = data.user;
	let agendas = $state(data.agendas);
	let edit_mode = $state(false);
	let currentErrors = $state({});

	// Remove Event Form
	const {
		form: removeEventForm,
		errors: removeEventErrors,
		message: removeEventMessage,
		enhance: removeEventEnhance
	} = superForm(data.removeEventForm, {
		dataType: 'json',
		taintedMessage: null,
		resetForm: false,
		invalidateAll: false,
		onSubmit: () => {
			if (!confirm('Are you sure you want to delete this event?')) {
				throw new Error('User cancelled the operation');
			}
		},
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				if (result.data === undefined) {
					$removeEventErrors._errors = ['Something went wrong. Please try again later.'];
					return;
				}
				// Update the errors state directly from the result
				$removeEventErrors = result.data.removeEventForm.errors;
			}
			if (result.type === 'success') {
				$removeEventErrors = {};
				if (result.data === undefined) {
					$removeEventMessage = 'Your data was removed but something went wrong.';
					return;
				}
				$removeEventMessage = result.data.removeEventForm.message;
				if (selectedAgenda == null) return;
				selectedAgenda.events = selectedAgenda.events.filter(
					(event) => event.Id !== result.data!.removeEventForm.data.eventId
				);
			}
		}
	});

	// Remove Agenda Form
	const {
		form: removeAgendaForm,
		errors: removeAgendaErrors,
		message: removeAgendaMessage,
		enhance: removeAgendaEnhance
	} = superForm(data.removeAgendaForm, {
		dataType: 'json',
		taintedMessage: null,
		resetForm: false,
		invalidateAll: false,
		onSubmit: () => {
			if (!confirm('Are you sure you want to delete this agenda?')) {
				throw new Error('User cancelled the operation');
			}
		},
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				if (result.data === undefined) {
					$removeAgendaErrors._errors = ['Something went wrong. Please try again later.'];
					return;
				}
				// Update the errors state directly from the result
				if (result.data.removeAgendaForm) {
					$removeAgendaErrors = result.data.removeAgendaForm.errors;
				} else {
					$removeAgendaErrors = result.data.form.errors;
				}
			}
			if (result.type === 'success') {
				$removeAgendaErrors = {};
				if (result.data === undefined) {
					$removeAgendaMessage = 'Your data was removed but something went wrong.';
					return;
				}
				$removeAgendaMessage = result.data.removeAgendaForm.message;
				agendas = agendas.filter(
					(agenda) => agenda.Id !== result.data!.removeAgendaForm.data.agendaId
				);
			}
		}
	});

	// Add Agenda Form
	let create_form_success = $state(false);
	const { form, errors, message, enhance } = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		resetForm: false,
		invalidateAll: false,
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				if (result.data == undefined) {
					$errors._errors = ['Something went wrong. Please try again later.'];
					return;
				}
				// Update the errors state directly from the result
				$errors = result.data.form.errors;
			}
			if (result.type === 'success') {
				$errors = {};
				if (result.data === undefined) {
					$message = 'Your data was added but something went wrong.';
					return;
				}

				$message = result.data.form.message;
				create_form_success = !true;
				agendas = [
					// @ts-expect-error - TS doesn't know that the data is valid
					...agendas,
					// @ts-expect-error - doesn't know that the data is valid
					{
						// One really strange monkey patch
						Id: 'unused',
						Title: result.data.form.data.title,
						Subtitle: result.data.form.data.subtitle,
						Body: result.data.form.data.body,
						StartTime: result.data.form.data.startTime,
						EndTime: result.data.form.data.endTime,
						CreatedAt: new Date(),
						UserId: user.Id
					}
				];
			}
		},
		onUpdate: ({ form }) => {
			// Keep errors in sync with form updates
			currentErrors = form.errors;
		}
	});

	// Add Event Form
	const {
		form: addEventForm,
		errors: addEventFormErrors,
		message: addEventFormMessage,
		enhance: addEventFormEnhance
	} = superForm(data.addEventForm, {
		dataType: 'json',
		taintedMessage: null,
		resetForm: false,
		invalidateAll: false,
		onResult: ({ result }) => {
			if (result.type === 'failure') {
				if (result.data == undefined) {
					$addEventFormErrors._errors = ['Something went wrong. Please try again later.'];
					return;
				}
				// Update the errors state directly from the result
				$addEventFormErrors = result.data.form.errors;
			}
			if (result.type === 'success') {
				$addEventFormErrors = {};
				if (result.data === undefined) {
					$addEventFormMessage = 'Your data was added but something went wrong.';
					return;
				}
				$addEventFormMessage = result.data.addEventForm.message;
				if (selectedAgenda == null) return;
				if (!edit_mode) {
					selectedAgenda.events = [...selectedAgenda.events, result.data.phonyEvent];
				} else {
					// Find the index of the event being edited
					const eventIndex = selectedAgenda.events.findIndex(
						(event) => event.Id === result.data.addEventForm.data.eventId
					);
					if (eventIndex !== -1) {
						// Update the event in place
						selectedAgenda.events[eventIndex] = result.data.phonyEvent;
					}
					edit_mode = false;
					// Reset form if exiting edit mode
					$addEventForm.eventId = '';
					$addEventForm.title = '';
					$addEventForm.speakerName = '';
					$addEventForm.subtitle = '';
					$addEventForm.body = '';
					$addEventForm.startTime = '';
					$addEventForm.endTime = '';
				}
			}
		},
		onUpdate: ({ form }) => {
			// Keep errors in sync with form updates
			currentErrors = form.errors;
		}
	});

	let showEventSheet = $state(false);
	let selectedAgenda: (typeof data.agendas)[0] | null = $state(null);
</script>

{#if data.debug}
	<div class="mb-4 rounded-sm border border-dotted border-muted-foreground p-4">
		<h1 class="border-b border-muted-foreground pb-2">FORM ERROR DEBUG VIEW</h1>
		<p class="py-3">To remove, set <strong>DEBUG</strong> to <b>false</b> in your .env file</p>
		<pre>
Errors: {JSON.stringify(currentErrors, null, 2)}
Message: {$message}
</pre>
	</div>
{/if}

<div class="container mx-auto py-10">
	<div class="mb-8 flex items-center justify-between">
		<section class="header text-archivo flex flex-col space-y-1 pb-8">
			<h1 class="text-5xl font-extralight lg:text-6xl">Manage Agenda</h1>
			<p class="text-lg lg:text-2xl">Manage agenda to be displayed</p>
			<p>{$removeAgendaErrors._errors}</p>
			<p>{$removeAgendaErrors.agendaId}</p>
			<p>{$removeAgendaMessage}</p>
		</section>
		<Dialog.Root bind:open={create_form_success}>
			<Dialog.Trigger>
				<Button>
					<Plus class="mr-2 h-4 w-4" />
					Create Agenda
				</Button>
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[600px]">
				{#if data.debug}
					<SuperDebug data={form} />
				{/if}
				<Dialog.Header>
					<Dialog.Title>Create New Agenda</Dialog.Title>
					<Dialog.Description>
						Create a new agenda item. Fill in all the required details below.
					</Dialog.Description>
				</Dialog.Header>
				<form
					action="?/addAgenda"
					id="agenda_form"
					method="POST"
					class="grid gap-4 py-4"
					use:enhance
				>
					<div class="grid gap-2">
						<Label for="title">Title</Label>
						<p class="text-sm text-destructive">
							{$errors.title}
						</p>
						<Input
							id="title"
							name="talentpool__event_title"
							bind:value={$form.title}
							placeholder="My Awesome Event"
						/>
					</div>
					<div class="grid gap-2">
						<Label for="subtitle">Subtitle (Optional)</Label>
						<p class="text-sm text-destructive">
							{$errors.subtitle}
						</p>
						<Input
							id="subtitle"
							name="talentpool__event_subtitle"
							bind:value={$form.subtitle}
							placeholder="Join us as we host 'Awesome Event'!"
						/>
					</div>
					<div class="grid gap-2">
						<Label for="body">Description</Label>
						<p class="text-sm text-destructive">
							{$errors.body}
						</p>
						<Textarea
							id="body"
							name="talentpool__event_body"
							bind:value={$form.body}
							placeholder="Enter agenda details..."
						/>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div class="grid gap-2">
							<Label for="startTime">Start Time</Label>
							<p class="text-sm text-destructive">
								{$errors.startTime}
							</p>
							<Input id="startTime" type="datetime-local" bind:value={$form.startTime} />
						</div>
						<div class="grid gap-2">
							<Label for="endTime">End Time</Label>
							<p class="text-sm text-destructive">
								{$errors.endTime}
							</p>
							<Input id="endTime" type="datetime-local" bind:value={$form.endTime} />
						</div>
					</div>
					<Dialog.Footer class="flex flex-col space-y-2 sm:flex-col">
						<Button type="submit">Create Agenda</Button>
						<p class="text-sm text-destructive">
							{$errors._errors}
						</p>
						<p class="text-sm text-success">{$message}</p>
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Title</Table.Head>
				<Table.Head>Date & Time</Table.Head>
				<Table.Head>Events</Table.Head>
				<Table.Head>Groups</Table.Head>
				<Table.Head class="text-right">Actions</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each agendas as agenda}
				<Table.Row>
					<Table.Cell>
						<div>
							<p class="font-medium">{agenda.Title}</p>
							<p class="text-sm text-muted-foreground">{agenda.Subtitle}</p>
						</div>
					</Table.Cell>
					<Table.Cell>
						<div class="flex items-center">
							<Calendar class="mr-2 h-4 w-4" />
							<span
								>{new Date(agenda.StartTime.toJSON().toString()).toLocaleDateString('en-US', {
									timeZone: 'UTC'
								})}</span
							>
							<Clock class="mx-2 h-4 w-4" />
							<span
								>{new Date(agenda.StartTime.toJSON().toString()).toLocaleTimeString('en-US', {
									timeZone: 'UTC'
								})} - {new Date(agenda.EndTime.toJSON().toString()).toLocaleTimeString('en-US', {
									timeZone: 'UTC'
								})}</span
							>
						</div>
					</Table.Cell>
					<Table.Cell>
						<Button
							variant="outline"
							title={agenda.Id === 'unused' ? 'Reload the page to edit or delete this agenda' : ''}
							disabled={agenda.Id === 'unused'}
							size="sm"
							onclick={() => {
								selectedAgenda = agenda;
								$addEventForm.agendaId = selectedAgenda.Id;
								showEventSheet = true;
							}}
						>
							{agenda.events?.length || 0} events
						</Button>
					</Table.Cell>
					<Table.Cell>
						<Button
							variant="outline"
							title={agenda.Id === 'unused' ? 'Reload the page to edit or delete this agenda' : ''}
							disabled={agenda.Id === 'unused'}
							size="sm"
							onclick={() => {
								// Navigate to groups page
								window.location.href = `/dashboard/settings/manage-groups/${agenda.Id}`;
							}}
						>
							<Users class="mr-2 h-4 w-4" />
							{agenda.groups?.length || 0} groups
						</Button>
					</Table.Cell>
					<Table.Cell class="text-right">
						<form action="?/deleteAgenda" method="POST" use:removeAgendaEnhance>
							<input type="hidden" name="agendaId" bind:value={$removeAgendaForm.agendaId} />
							<Button
								variant="ghost"
								disabled={agenda.Id === 'unused'}
								title={agenda.Id === 'unused'
									? 'Reload the page to edit or delete this agenda'
									: ''}
								size="icon"
								type="submit"
								onclick={() => ($removeAgendaForm.agendaId = agenda.Id)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</form>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<Sheet.Root bind:open={showEventSheet}>
	<Sheet.Content side="right" class="w-[900px]">
		<Sheet.Header>
			<Sheet.Title>Manage Events</Sheet.Title>
			<Sheet.Description>
				Add or edit events for <b>{selectedAgenda?.Title}</b>
			</Sheet.Description>
		</Sheet.Header>
		<ScrollArea class="h-full w-full py-4">
			<form method="POST" action="?/addEvent" class="grid gap-4" use:addEventFormEnhance>
				{#if edit_mode}
					<input type="hidden" name="eventId" bind:value={$addEventForm.eventId} />
				{/if}
				<input type="hidden" name="agendaId" bind:value={$addEventForm.agendaId} />
				<input type="hidden" name="agendaId" value={selectedAgenda?.Id} />
				<div class="grid gap-2">
					<Label>Event Title</Label>
					<p class="text-sm text-destructive">
						{$addEventFormErrors.title}
					</p>
					<Input name="title" placeholder="Keynote Speech" bind:value={$addEventForm.title} />
				</div>
				<div class="grid gap-2">
					<Label>Speaker Name</Label>
					<p class="text-sm text-destructive">
						{$addEventFormErrors.speakerName}
					</p>
					<Input name="speakerName" placeholder="John Doe" bind:value={$addEventForm.speakerName} />
				</div>
				<div class="grid gap-2">
					<Label>Subtitle</Label>
					<p class="text-sm text-destructive">
						{$addEventFormErrors.subtitle}
					</p>
					<Input
						name="subtitle"
						placeholder="Event subtitle..."
						bind:value={$addEventForm.subtitle}
					/>
				</div>
				<div class="grid gap-2">
					<Label>Description</Label>
					<p class="text-sm text-destructive">
						{$addEventFormErrors.body}
					</p>
					<Textarea name="body" placeholder="Event details..." bind:value={$addEventForm.body} />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label>Start Time</Label>
						<p class="text-sm text-destructive">
							{$addEventFormErrors.startTime}
						</p>
						<Input name="startTime" type="datetime-local" bind:value={$addEventForm.startTime} />
					</div>
					<div class="grid gap-2">
						<Label>End Time</Label>
						<p class="text-sm text-destructive">
							{$addEventFormErrors.endTime}
						</p>
						<Input name="endTime" type="datetime-local" bind:value={$addEventForm.endTime} />
					</div>
				</div>
				<div class="grid">
					<div class="flex w-fit items-center justify-center gap-2">
						<Input
							title={$addEventForm.startTime === ''
								? 'Start time must be set to use this option'
								: ''}
							disabled={$addEventForm.startTime === ''}
							name="sameEndTime"
							type="checkbox"
							onchange={(e) => {
								if (e.target!.checked) {
									$addEventForm.endTime = $addEventForm.startTime;
								} else {
									$addEventForm.endTime = '';
								}
							}}
						/>
						<Label>Same End Time</Label>
					</div>
				</div>
				<Button type="submit" class={edit_mode ? 'bg-blue-500 hover:bg-blue-600' : ''}>
					{#if edit_mode}
						Edit Event
					{:else}
						Add Event
					{/if}
				</Button>
			</form>

			<div class="mt-8">
				<h3 class="mb-4 text-lg font-medium">Existing Events</h3>
				{#if selectedAgenda?.events?.length}
					{#each selectedAgenda.events as event}
						<div class="mb-4 rounded-lg border p-4">
							<div class="flex items-start justify-between">
								<div>
									<h4 class="font-medium">{event.Title}</h4>
									<p class="text-sm text-muted-foreground">{event.SpeakerName}</p>
								</div>

								<form action="?/deleteEvent" method="POST" use:removeEventEnhance>
									<input type="hidden" name="eventId" bind:value={$removeEventForm.eventId} />
									<Button
										variant="ghost"
										size="icon"
										type="submit"
										onclick={() => ($removeEventForm.eventId = event.Id)}
									>
										<Trash2 class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onclick={() => {
											edit_mode = !edit_mode;
											if (edit_mode) {
												$addEventForm.eventId = event.Id;
												$addEventForm.title = event.Title;
												$addEventForm.speakerName = event.SpeakerName ? event.SpeakerName : '';
												$addEventForm.subtitle = event.Subtitle ? event.Subtitle : '';
												$addEventForm.body = event.Body;
												$addEventForm.startTime = new Date(event.StartTime.toJSON().toString())
													.toISOString()
													.slice(0, 16);
												$addEventForm.endTime = new Date(event.EndTime.toJSON().toString())
													.toISOString()
													.slice(0, 16);
											} else {
												// Reset form if exiting edit mode
												$addEventForm.eventId = '';
												$addEventForm.title = '';
												$addEventForm.speakerName = '';
												$addEventForm.subtitle = '';
												$addEventForm.body = '';
												$addEventForm.startTime = '';
												$addEventForm.endTime = '';
											}
										}}
										class={edit_mode && $addEventForm.eventId === event.Id
											? 'bg-blue-500 text-background hover:bg-blue-600 hover:text-slate-50'
											: ''}
									>
										<Pencil class="h-4 w-4" />
									</Button>
								</form>
							</div>
							<div class="mt-2 text-sm">
								<p>{event.Body}</p>
								<div class="mt-2 flex items-center text-muted-foreground">
									<Clock class="mr-2 h-4 w-4" />
									<span
										>{new Date(event.StartTime.toJSON().toString()).toLocaleTimeString('en-US', {
											timeZone: 'UTC'
										})} - {new Date(event.EndTime.toJSON().toString()).toLocaleTimeString('en-US', {
											timeZone: 'UTC'
										})}</span
									>
								</div>
							</div>
						</div>
					{/each}
				{:else}
					<p class="text-muted-foreground">No events added yet.</p>
				{/if}
			</div>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
