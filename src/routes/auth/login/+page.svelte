<script lang="ts">
	import { goto } from '$app/navigation';
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

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-sky-600">
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
				</svg>
			</div>
			<h2 class="mt-6 text-3xl font-bold text-gray-900">
				Welcome to UBSC
			</h2>
			<p class="mt-2 text-sm text-gray-600">
				University of Belize ACM Chapter
			</p>
		</div>

		<div class="bg-white rounded-xl shadow-lg p-8">
			<form on:submit|preventDefault={handleLogin} class="space-y-6">
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
						Email Address
					</label>
					<input
						id="email"
						type="email"
						required
						bind:value={email}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
						placeholder="your.email@ub.edu.bz"
						disabled={loading}
					/>
				</div>

				<div>
					<label for="password" class="block text-sm font-medium text-gray-700 mb-2">
						Password
					</label>
					<input
						id="password"
						type="password"
						required
						bind:value={password}
						class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"
						placeholder="Your password"
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						{error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{#if loading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
							class="font-medium text-sky-600 hover:text-sky-500 transition-colors"
						>
							Register with invite code
						</a>
					</p>
				</div>
			</form>
		</div>
	</div>
</div>
