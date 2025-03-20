<script lang="ts">
	import { page } from '$app/stores';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import { cn } from '$lib/components/vendor/utils';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	// import { type RegisterForm } from './+page';
	let JSOnly: HTMLSpanElement;
	let data: PageData = $props();
	const page_query = $page.url.search;
	// Parse the query string
	const query = new URLSearchParams(page_query);
	// Get the 'account_type' query string value
	const forced_account_type = query.get('force_choice');
	// Set the account type to the query string value
	let accountTimeout: ReturnType<typeof setTimeout>;
	let accountType = $state('');
	const { form, errors, constraints, enhance } = superForm(data.form?.super_form ?? data.data, {
		taintedMessage: 'You have unsaved changes. Are you sure you want to leave?'
	});

	// We run these things on the server and not on the client (OnMount) for a very good reason
	if (forced_account_type) {
		console.log(forced_account_type);
		$form.account_type = forced_account_type === 'host' ? 'host' : 'student';
	}
	accountType = $form.account_type;

	onMount(() => {
		JSOnly.classList.remove('hidden');
	});
</script>

<!-- <SuperDebug bind:data={$form} /> -->
<!-- svelte-ignore component_name_lowercase -->
<page
	class="my-8 flex w-full items-center justify-center self-stretch bg-violet-100 lg:m-0 lg:h-[90vh]"
>
	<r-column
		class="hidden h-full flex-[2] flex-col items-center justify-end gap-2 self-stretch lg:flex"
	>
		<div class="flex flex-col items-start justify-center self-stretch px-20 py-20"><Logo /></div>
	</r-column>
	<l-column class="flex h-full flex-col items-center justify-center bg-violet-50 lg:flex-1 lg:gap-8">
		<Card.Root class="w-[305px] py-4 lg:w-[375px]">
			<card-content class="flex flex-col items-center space-y-10 p-4 text-center">
				<div class="flex flex-col items-center justify-center gap-8">
					<Card.Title class="text-center font-normal">
						<p class="text-2xl">Join <b>IT Careers</b></p>
						<p>Tell us who you are.</p>
					</Card.Title>
					<Logo />
				</div>
				<form
					method="POST"
					action="?/register"
					class="flex w-full flex-col items-center gap-4 text-left"
					use:enhance
				>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="account-type">Who are you?</Label>
						<span bind:this={JSOnly} class="hidden self-stretch">
							<div class="flex w-full flex-row items-center gap-2 self-stretch">
								<Button
									onclick={() => (accountType = 'student')}
									class={cn(
										'flex-1',
										accountType === 'student'
											? 'border border-violet-900 bg-transparent text-violet-900 hover:bg-transparent'
											: ''
									)}>I am a student</Button
								>
								<Button
									onclick={() => (accountType = 'host')}
									class={cn(
										accountType === 'host'
											? 'border border-violet-900 bg-transparent text-violet-900 hover:bg-transparent'
											: ''
									)}>I am a host</Button
								>
								<input
									type="hidden"
									id="account-type"
									name="account_type"
									bind:value={accountType}
								/>
							</div>
						</span>
						<noscript>
							<Input
								type="text"
								id="account-type"
								name="account_type"
								placeholder="Type 'student' or 'host'"
								{...$constraints.account_type}
								bind:value={accountType}
							/>
						</noscript>
						<p class="text-sm text-red-600">{$errors.account_type}</p>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="full-name"
							>{accountType === 'student' ? 'Full name' : 'Organization name'}</Label
						>
						<Input
							class="invalid:border-red-500"
							type="text"
							id="full-name"
							name="full_name"
							placeholder={accountType === 'student'
								? 'Type in your full name'
								: 'Type in an account name'}
							pattern="[A-Za-z\s]+"
							bind:value={$form.full_name}
							{...$constraints.full_name}
						/>
						<p class="text-sm text-red-600">{$errors.full_name}</p>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="email" class="jsonly"
							>{accountType === 'student' ? 'UB Student ID' : 'Email address'}</Label
						>
						<noscript>
							<Label for="email">Email address</Label>
						</noscript>

						<Input
							class="jsonly invalid:border-red-500"
							type="email"
							name="email"
							id="email"
							placeholder={accountType === 'student'
								? 'Type in your Student ID'
								: 'Type in your email address'}
							bind:value={$form.email}
							{...$constraints.email}
							required={false}
							onfocusout={(e) => {
								clearTimeout(accountTimeout);
								accountTimeout = setTimeout(() => {
									const event: Event = e;
									if (!event) return;
									if (accountType === 'student' && event.target.value.trim() === '') return;
									if (accountType === 'student' && !event.target.value.includes('@ub.edu.bz')) {
										event.target.value = (
											event.target.value.replace(/@.*$/, '') + '@ub.edu.bz'
										).trim();
									}
								}, 590);
							}}
						/>
						<noscript>
							<Input
								class=" invalid:border-red-500"
								type="email"
								name="email"
								id="email"
								placeholder="Type in your email address"
								bind:value={$form.email}
								required={false}
								{...$constraints.email}
							/>
						</noscript>
						<p class="text-sm text-red-600">{$errors.email}</p>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="password">Password</Label>
						<Input
							class="invalid:border-red-500"
							type="password"
							id="password"
							name="password"
							placeholder="Your password"
							bind:value={$form.password}
							{...$constraints.password}
						/>
						<p class="text-sm text-red-600">{$errors.password}</p>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="confirm-password">Confirm password</Label>
						<Input
							class="invalid:border-red-500"
							type="password"
							id="confirm-password"
							name="password_confirmation"
							placeholder="Your password once more"
							bind:value={$form.password_confirmation}
							{...$constraints.password_confirmation}
						/>
						<p class="text-sm text-red-600">{$errors.password_confirmation}</p>
					</div>
					<Button type="submit" class="w-full">Join the network</Button>

					<p class="text-center text-sm font-normal">
						By signing up, you agree to abide by the <a href="https://www.ub.edu.bz/wp-content/uploads/2024/09/Student-Handbook-APPROVED-May-2024.pdf"><underline class="underline"
							>UB Student Code of Conduct Policy</underline
						>.</a>
					</p>
				</form>
			</card-content>
		</Card.Root>

		<section class="block text-center">
			<p>
				Already a part of the network? <a href="/auth/login" class="hover:opacity-90"
					><b>Sign in</b></a
				>
			</p>
		</section>
	</l-column>
</page>
