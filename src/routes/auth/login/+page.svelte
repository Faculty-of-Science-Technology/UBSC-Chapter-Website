<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/global/branding/logo.svelte';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let loading = false;
	let error = '';

	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const result = await response.json();

			if (response.ok) {
				goto('/dashboard');
			} else {
				error = result.error || 'Login failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		}

		loading = false;
	}

	onMount(() => {
		// Focus on email field when page loads
		document.getElementById('email')?.focus();
	});
</script>

<svelte:head>
	<title>Login - UBSC Chapter</title>
	<meta name="description" content="Sign in to your UBSC Chapter account" />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted to-primary px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-fit w-full items-center justify-center">
				<Logo mode="light" size="md" />
			</div>
			<HeroText class="items-center" prelude="" text_light_blue="Welcome to UBSC" text="" subtitle="Logon using your credentials"/>
			<!-- <h2 class="mt-6 text-3xl font-bold text-secondary">Welcome to UBSC</h2> -->
			<!-- <p class="mt-2 text-sm text-gray-600">University of Belize ACM Chapter</p> -->
		</div>

		<div class="rounded-xl bg-muted p-8 shadow-lg">
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
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

				<div>
					<label for="password" class="mb-2 block text-sm font-medium text-secondary/70">
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
						placeholder="Your password"
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
						{error}
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
						Signing in...
					{:else}
						Sign In
					{/if}
				</button>

				<div class="text-center">
					<p class="text-sm text-gray-600">
						Don't have an account?
						<a
							href="/auth/register"
							class="font-medium text-primary transition-colors hover:text-sky-500"
						>
							Register with invite code
						</a>
					</p>
					<p class="text-sm text-gray-600">
						Forgot your password?
						<a
							href="/auth/forgot-password"
							class="font-medium text-primary transition-colors hover:text-sky-500"
						>
							Reset it here
						</a>
					</p>
				</div>
			</form>
		</div>
	</div>
</div>
