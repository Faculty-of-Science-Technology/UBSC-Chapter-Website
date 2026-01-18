<script lang="ts">
	import Logo from '$lib/components/global/branding/logo.svelte';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import { onMount } from 'svelte';

	let email = '';
	let loading = false;
	let success = '';
	let error = '';

	async function handleReset() {
		if (!email) {
			error = 'Please enter your email';
			return;
		}

		loading = true;
		error = '';
		success = '';

		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email })
			});

			const result = await response.json();

			if (response.ok) {
				success = 'If this email is registered, a reset link has been sent.';
			} else {
				error = result.error || 'Failed to send reset link';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		}

		loading = false;
	}

	onMount(() => {
		document.getElementById('email')?.focus();
	});
</script>

<svelte:head>
	<title>Password Reset - UBSC Chapter</title>
	<meta name="description" content="Reset your UBSC Chapter account password" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted to-primary px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-fit w-full items-center justify-center">
				<Logo mode="light" size="md" />
			</div>
			<HeroText
				class="items-center"
				prelude=""
				text_light_blue="Reset Your"
				text="Password"
				subtitle="Enter your email to receive a password reset link."
			/>
		</div>

		<div class="rounded-xl bg-muted p-8 shadow-lg">
			<form on:submit|preventDefault={handleReset} class="space-y-6">
				<div>
					<label for="email" class="mb-2 block text-sm font-medium text-secondary/70">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						required
						bind:value={email}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
						placeholder="your.email@ub.edu.bz"
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				{/if}

				{#if success}
					<div class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
						{success}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="flex w-full justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-background shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#if loading}
						<svg
							class="-ml-1 mr-3 h-5 w-5 animate-spin text-background"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Sending...
					{:else}
						Send Reset Link
					{/if}
				</button>

				<div class="text-center">
					<p class="text-sm text-gray-600">
						Remember your password?
						<a href="/auth/login" class="font-medium text-primary transition-colors hover:text-sky-500">
							Log in
						</a>
					</p>
				</div>
			</form>
		</div>
	</div>
</div>
