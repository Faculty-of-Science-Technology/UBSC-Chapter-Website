<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	interface LoginData extends PageData {
		form?: {
			super_form: any;
		};
	}
	let data: LoginData = $props();
	const { form, errors, constraints, enhance } = superForm(data.form?.super_form ?? data.data);
</script>

<!-- <SuperDebug data={$form}/> -->
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
						<p class="text-2xl">Continue to <b>IT Careers</b></p>
						<p>Access the portal by using your UB Account</p>
					</Card.Title>
					<Logo />
				</div>
				<form
					method="POST"
					action="?/login"
					class="flex w-full flex-col items-center gap-4 text-left"
					use:enhance
				>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="email">Email address</Label>
						<Input
							bind:value={$form.email}
							type="email"
							id="email"
							name="email"
							placeholder="Type in your email address"
							{...$constraints.email}
						/>
						<p class="text-sm text-red-600">{$errors.email}</p>
					</div>
					<div class="grid w-full max-w-sm items-center gap-1.5">
						<Label for="password">Password</Label>
						<Input
							type="password"
							id="password"
							name="password"
							placeholder="Your password"
							bind:value={$form.password}
						/>
						<p class="text-sm text-red-600">{$errors.password}</p>
					</div>
					<Button type="submit" class="w-full">Sign in</Button>
					<!-- <button
						class="flex w-full flex-col items-center justify-center self-stretch rounded-lg border border-slate-300 py-2 hover:bg-slate-100"
					>
						<div class="flex flex-row items-center gap-2">
							<svg
								width="20"
								height="21"
								viewBox="0 0 20 21"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g id="Google">
									<path
										id="Intersect"
										d="M1.02388 14.9309L4.38721 12.359C4.1949 11.7749 4.09091 11.15 4.09091 10.5C4.09091 9.85001 4.1949 9.22513 4.38721 8.64102L1.02388 6.06906C0.367906 7.40272 0 8.90631 0 10.5C0 12.0937 0.367906 13.5973 1.02388 14.9309Z"
										fill="#FBBC05"
									/>
									<path
										id="Intersect_2"
										d="M4.38725 8.64102C5.16325 6.28407 7.3773 4.59091 10 4.59091C11.4091 4.59091 12.6819 5.09091 13.6819 5.90909L16.591 3C14.8182 1.45455 12.5455 0.5 10 0.5C6.04828 0.5 2.6505 2.7621 1.02393 6.06906L4.38725 8.64102Z"
										fill="#EA4335"
									/>
									<path
										id="Subtract"
										d="M10.0001 20.5C6.04719 20.5 2.64863 18.2366 1.02258 14.9282L4.38454 12.3507C5.15807 14.712 7.37423 16.4091 10.0001 16.4091C11.2849 16.4091 12.4234 16.1065 13.325 15.5375L16.518 18.0095C14.7701 19.6346 12.4392 20.5 10.0001 20.5Z"
										fill="#34A853"
									/>
									<path
										id="Intersect_3"
										d="M10 8.68182H19.3182C19.4545 9.27273 19.5455 9.9091 19.5455 10.5C19.5455 13.7593 18.3531 16.3032 16.5179 18.0095L13.325 15.5375C14.369 14.8786 15.0953 13.8626 15.3636 12.5455H10V8.68182Z"
										fill="#4285F4"
									/>
								</g>
								<p>Sign in with Google</p>
							</svg>
						</div>
					</button> -->
				</form>
				<!-- <p class="text-sm font-normal">
					By signing in, you agree to abide by the <underline class="underline"
						>UB Student Conduct Policy</underline
					>.
				</p> -->
			</card-content>
		</Card.Root>
		<section class="block text-center">
			<p>
				Are you new here? <a href="/auth/register" class="hover:opacity-90"><b>Join here</b></a>
			</p>
			<p>(All Hosts and Students)</p>
		</section>
	</l-column>
</page>
