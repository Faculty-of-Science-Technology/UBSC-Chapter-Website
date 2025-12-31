<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/global/branding/logo.svelte';
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import { onMount } from 'svelte';

	let formData = $state({
		firstName: '',
		lastName: '',
		email: '',
		username: '',
		password: '',
		confirmPassword: '',
		phone: '',
		inviteCode: ''
	});

	let loading = $state(false);
	let error = $state('');
	let inviteCodeValid = $state(false);
	let checkingInvite = $state(false);
	let step = $state(1); // 1: invite code, 2: registration form

	async function validateInviteCode(e: Event) {
		e.preventDefault();
		if (!formData.inviteCode) {
			error = 'Please enter an invite code';
			return;
		}

		checkingInvite = true;
		error = '';

		try {
			const response = await fetch('/api/auth/validate-invite', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ code: formData.inviteCode })
			});

			const result = await response.json();

			if (response.ok) {
				inviteCodeValid = true;
				step = 2;
				// Focus on first name field when moving to step 2
				setTimeout(() => {
					document.getElementById('firstName')?.focus();
				}, 100);
			} else {
				error = result.error || 'Invalid invite code';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		}

		checkingInvite = false;
	}

	async function handleRegister(e: Event) {
		e.preventDefault();
		if (
			!formData.firstName ||
			!formData.lastName ||
			!formData.email ||
			!formData.username ||
			!formData.password ||
			!formData.confirmPassword
		) {
			error = 'Please fill in all required fields';
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (formData.password.length < 6) {
			error = 'Password must be at least 6 characters long';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					username: formData.username,
					password: formData.password,
					phone: formData.phone,
					inviteCode: formData.inviteCode
				})
			});

			const result = await response.json();

			if (response.ok) {
				// Registration successful, redirect to login
				goto('/auth/login?message=Registration successful. Please log in.');
			} else {
				error = result.error || 'Registration failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		}

		loading = false;
	}

	function goBackToInviteStep() {
		step = 1;
		inviteCodeValid = false;
		error = '';
	}

	onMount(() => {
		// Focus on invite code field when page loads
		document.getElementById('inviteCode')?.focus();
	});
</script>

<svelte:head>
	<title>Register - UBSC Chapter</title>
	<meta name="description" content="Join the UBSC Chapter with an invite code" />
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted to-primary px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto flex h-fit w-full items-center justify-center">
				<Logo mode="dark" size="md" />
			</div>
			<HeroText
				class="items-center"
				prelude=""
				text_light_blue="Join UBACMSC"
				text=""
				subtitle="Join using your invite code"
			/>
			<!-- <h2 class="mt-6 text-3xl font-bold text-secondary">Welcome to UBSC</h2> -->
			<!-- <p class="mt-2 text-sm text-gray-600">University of Belize ACM Chapter</p> -->
		</div>

		<div class="rounded-xl bg-muted p-8 shadow-lg">
			{#if step === 1}
				<!-- Invite Code Step -->
				<form onsubmit={validateInviteCode} class="space-y-6">
					<div>
						<label for="inviteCode" class="mb-2 block text-sm font-medium text-secondary/70">
							Invite Code
						</label>
						<input
							id="inviteCode"
							type="text"
							required
							bind:value={formData.inviteCode}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 text-center font-mono text-lg uppercase tracking-widest shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
							placeholder="ABC12345"
							disabled={checkingInvite}
							maxlength="8"
							oninput={(e) => {
								formData.inviteCode = e.target.value.toUpperCase();
							}}
						/>
						<p class="mt-1 text-xs text-secondary/80">Enter the 8-character invite code you received</p>
					</div>

					{#if error}
						<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{error}
						</div>
					{/if}

					<button
						type="submit"
						disabled={checkingInvite}
						class="flex w-full justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-medium text-background shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if checkingInvite}
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
							Validating...
						{:else}
							Validate Invite Code
						{/if}
					</button>

					<div class="text-center">
						<p class="text-sm text-gray-600">
							Already have an account?
							<a
								href="/auth/login"
								class="font-medium text-sky-600 transition-colors hover:text-sky-500"
							>
								Sign in
							</a>
						</p>
					</div>
				</form>
			{:else}
				<!-- Registration Form Step -->
				<div class="mb-4 flex items-center">
					<button
						onclick={goBackToInviteStep}
						class="flex items-center text-sm font-medium text-sky-600 transition-colors hover:text-sky-500"
					>
						<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							></path>
						</svg>
						Back to invite code
					</button>
					<div class="ml-4 flex items-center text-sm text-green-600">
						<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							></path>
						</svg>
						Invite code verified
					</div>
				</div>

				<form onsubmit={handleRegister} class="space-y-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="firstName" class="mb-1 block text-sm font-medium text-secondary/70">
								First Name *
							</label>
							<input
								id="firstName"
								type="text"
								required
								bind:value={formData.firstName}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
								disabled={loading}
							/>
						</div>
						<div>
							<label for="lastName" class="mb-1 block text-sm font-medium text-secondary/70">
								Last Name *
							</label>
							<input
								id="lastName"
								type="text"
								required
								bind:value={formData.lastName}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
								disabled={loading}
							/>
						</div>
					</div>

					<div>
						<label for="email" class="mb-1 block text-sm font-medium text-secondary/70">
							Email Address *
						</label>
						<input
							id="email"
							type="email"
							required
							bind:value={formData.email}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
							placeholder="your.email@ub.edu.bz"
							disabled={loading}
						/>
					</div>

					<div>
						<label for="username" class="mb-1 block text-sm font-medium text-secondary/70">
							Username *
						</label>
						<input
							id="username"
							type="text"
							required
							bind:value={formData.username}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
							placeholder="Username (3-16 characters)"
							disabled={loading}
							maxlength="16"
						/>
					</div>

					<div>
						<label for="phone" class="mb-1 block text-sm font-medium text-secondary/70">
							Phone Number
						</label>
						<input
							id="phone"
							type="tel"
							bind:value={formData.phone}
							class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
							placeholder="(Optional)"
							disabled={loading}
						/>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="password" class="mb-1 block text-sm font-medium text-secondary/70">
								Password *
							</label>
							<input
								id="password"
								type="password"
								required
								bind:value={formData.password}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
								placeholder="Min. 6 characters"
								disabled={loading}
							/>
						</div>
						<div>
							<label for="confirmPassword" class="mb-1 block text-sm font-medium text-secondary/70">
								Confirm Password *
							</label>
							<input
								id="confirmPassword"
								type="password"
								required
								bind:value={formData.confirmPassword}
								class="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-500"
								placeholder="Repeat password"
								disabled={loading}
							/>
						</div>
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
							Creating account...
						{:else}
							Create Account
						{/if}
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
