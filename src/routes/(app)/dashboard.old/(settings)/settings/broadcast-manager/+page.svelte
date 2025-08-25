<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import { Mail, Send, Users } from 'lucide-svelte';
	import SuperDebug from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const recipientCount = data.recipientCount;

	// Form setup with SuperForms
	const { form, errors, enhance, message } = superForm(data.form, {
		dataType: 'json',
		taintedMessage: 'You have unsaved changes. Are you sure you want to leave?',
		resetForm: true,
		onResult({ result }) {
			if (result.type === 'success') {
				// Clear the form after successful submission
				$form.subject = '';
				$form.message = '';
			}
            isSubmitting = false;
		}
	});

	// Track if the form is currently being submitted
	let isSubmitting = $state(false);

	function handleSubmit() {
		isSubmitting = true;
	}
</script>

<div class="container mx-auto py-6">
	<div class="mb-8">
		<h2 class="text-3xl font-bold tracking-tight">Broadcast Manager</h2>
		<p class="text-muted-foreground">Send email messages to all users on the platform</p>
	</div>

	{#if data.debug}
		<SuperDebug data={$form} />
	{/if}

	<div class="grid gap-6">
		<Card.Root>
			<Card.Header class="flex flex-row items-center gap-4">
				<div class="rounded-full bg-primary/10 p-2">
					<Mail class="h-6 w-6 text-primary" />
				</div>
				<div>
					<Card.Title>Broadcast Email</Card.Title>
					<Card.Description>
						Compose and send an email to all registered users on the platform
					</Card.Description>
				</div>
			</Card.Header>
			<Card.Content>
				<form class="space-y-6" method="POST" use:enhance onsubmit={handleSubmit}>
					<div class="space-y-4">
						<div class="space-y-2">
							<Label for="subject" class="text-base">Email Subject</Label>
							<Input
								id="subject"
								name="subject"
								bind:value={$form.subject}
								placeholder="Enter an engaging subject line"
								class="w-full"
							/>
							{#if $errors.subject}
								<p class="text-sm text-destructive">{$errors.subject}</p>
							{/if}
						</div>

						<div class="space-y-2">
							<Label for="message" class="text-base">Email Message</Label>
							<Textarea
								id="message"
								name="message"
								bind:value={$form.message}
								placeholder="Compose your message here..."
								class="min-h-[300px]"
							/>
							{#if $errors.message}
								<p class="text-sm text-destructive">{$errors.message}</p>
							{/if}
							<p class="text-xs text-muted-foreground">
								Plain text only. Format carefully for readability.
							</p>
						</div>

						<div
							class="flex items-center gap-2 rounded-md bg-yellow-100 p-3 text-sm text-yellow-800"
						>
							<Users class="h-4 w-4" />
							<p>
								This message will be sent to <span class="font-bold">{recipientCount}</span>
								recipient{recipientCount !== 1 ? 's' : ''}
							</p>
						</div>

						{#if $message}
							<div class="rounded-md bg-green-100 p-3 text-sm text-green-800">
								{$message}
							</div>
						{/if}
					</div>

					<div class="flex justify-end">
						<Button type="submit" class="gap-2" disabled={isSubmitting}>
							{#if isSubmitting}
								<div class="animate-spin">
									<Mail class="h-4 w-4" />
								</div>
								Sending...
							{:else}
								<Send class="h-4 w-4" />
								Send Broadcast
							{/if}
						</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center gap-4">
				<div class="rounded-full bg-primary/10 p-2">
					<Users class="h-6 w-6 text-primary" />
				</div>
				<div>
					<Card.Title>Best Practices</Card.Title>
					<Card.Description>Guidelines for sending effective broadcast emails</Card.Description>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<h3 class="text-lg font-medium">When to send broadcasts</h3>
						<ul class="ml-6 mt-2 list-disc text-sm text-muted-foreground">
							<li>Important platform announcements or updates</li>
							<li>Upcoming maintenance or planned downtime</li>
							<li>New features or opportunities available to users</li>
							<li>Critical security information</li>
						</ul>
					</div>

					<div>
						<h3 class="text-lg font-medium">Writing effective messages</h3>
						<ul class="ml-6 mt-2 list-disc text-sm text-muted-foreground">
							<li>Use clear, concise subject lines</li>
							<li>Keep messages focused on a single topic</li>
							<li>Include specific actions recipients should take</li>
							<li>Provide contact information for questions or support</li>
							<li>Avoid sending too many broadcasts in a short time period</li>
						</ul>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
