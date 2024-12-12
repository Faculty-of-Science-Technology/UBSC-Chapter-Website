<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import { cn } from '$lib/components/vendor/utils';
	import { onMount } from 'svelte';
	let accountType = 'who-knows';

	let JSOnly: HTMLSpanElement;

	onMount(() => {
		JSOnly.classList.remove('hidden');
	});
</script>

<page
	class="my-8 flex w-full items-center justify-center self-stretch bg-slate-100 lg:m-0 lg:h-[90vh]"
>
	<r-column
		class="hidden h-full flex-[2] flex-col items-center justify-end gap-2 self-stretch lg:flex"
	>
		<div class="flex flex-col items-start justify-center self-stretch px-20 py-20"><Logo /></div>
	</r-column>
	<l-column class="flex h-full flex-col items-center justify-center bg-slate-50 lg:flex-1 lg:gap-8">
		<Card.Root class="w-[305px] py-4 lg:w-[375px]">
			<card-content class="flex flex-col items-center space-y-10 p-4 text-center">
				<div class="flex flex-col items-center justify-center gap-8">
					<Card.Title class="text-center font-normal">
						<p class="text-2xl">Join <b>talentpool</b></p>
						<p>Tell us who you are.</p>
					</Card.Title>
					<Logo />
				</div>
				<form class="flex w-full flex-col items-center gap-4 text-left">
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="account-type">Who are you?</Label>
						<span bind:this={JSOnly} class="hidden self-stretch">
							<div class="flex w-full flex-row items-center gap-2 self-stretch">
								<Button
									onclick={() => (accountType = 'student')}
									class={cn(
										'flex-1',
										accountType === 'student'
											? 'border border-slate-900 bg-transparent text-slate-900 hover:bg-transparent'
											: ''
									)}>I am a student</Button
								>
								<Button
									onclick={() => (accountType = 'host')}
									class={cn(
										accountType === 'host'
											? 'border border-slate-900 bg-transparent text-slate-900 hover:bg-transparent'
											: ''
									)}>I am a host</Button
								>
								<input type="hidden" id="account-type" value={accountType} />
							</div>
						</span>
						<noscript>
							<Input type="text" id="account-type" placeholder="Type 'student' or 'host'" />
						</noscript>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="full-name">Full name</Label>
						<Input
							class="invalid:bg-red-500"
							type="text"
							id="full-name"
							placeholder="Type in your full name"
							pattern="[A-Za-z\s]+"
						/>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="email">Email address</Label>
						<Input type="email" id="email" placeholder="Type in your email address" />
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="password">Password</Label>
						<Input type="password" id="password" placeholder="Your password" />
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="confirm-password">Confirm password</Label>
						<Input type="password" id="confirm-password" placeholder="Your password once more" />
					</div>
					<Button class="w-full">Join the network</Button>

					<p class="text-center text-sm font-normal">
						By signing up, you agree to abide by the <underline class="underline"
							>UB Student Conduct Policy</underline
						>.
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
