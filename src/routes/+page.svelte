<script lang="ts">
	import { goto } from '$app/navigation';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import { CheckSquare, Mail, Rocket } from 'lucide-svelte';
	// import * as m from '$lib/paraglide/messages.js';
</script>

<page class="m-3 flex flex-col gap-24 lg:m-20">
	<hero class="flex flex-col items-center justify-center">
		<options-container
			class="space-between flex-start flex w-full flex-col gap-4 text-5xl font-extralight lg:flex-row lg:text-5xl"
		>
			<kickstart-career
				class="flex flex-1 flex-col items-start gap-4 self-stretch rounded-lg border border-slate-300 p-4 lg:border-0"
			>
				<Rocket size="84" strokeWidth="1" />
				<p>Kickstart Your <span class="font-medium underline">Career</span></p>
				<p class="text-inter text-xl font-medium">Find your next job</p>
				<Button class="w-fit" onclick={() => goto('/auth/register')}>Register as an Intern</Button>
			</kickstart-career>
			<acquire-talent
				class="flex flex-1 flex-col items-start gap-4 self-stretch border border-slate-300 p-4 lg:border-0"
			>
				<CheckSquare size="84" strokeWidth="1" />
				<p>Acquire <span class="font-medium underline">Talent</span></p>
				<p class="text-inter text-xl font-medium">Because, why look anywhere else?</p>
				<Button class="w-fit" onclick={() => goto('/auth/register')}>Register as a Host</Button>
			</acquire-talent>
		</options-container>
	</hero>
	<page-content class="flex flex-col items-start gap-12">
		<call-to-action
			class="flex w-full flex-col items-center justify-center gap-4 self-stretch rounded-lg border border-slate-300 p-8 text-center"
		>
			<p class="w-full text-5xl font-semibold lg:w-[775px] lg:text-6xl">
				Not <span class="italic">JUST</span> your typical hiring platform.
			</p>
			<p class="text-xl lg:w-[720px]">
				We connect you with locals nearby. People willing to work. 99.9% of the time available. Does
				this sound good to you? <b>Continue reading</b> along.
			</p>
		</call-to-action>
		<article
			class="flex w-full flex-col items-start justify-center gap-4 self-stretch rounded-lg p-8 text-left"
		>
			<p class="w-full text-3xl font-semibold lg:w-[775px] lg:text-6xl">
				We understand. Hiring people is a tricky task.
			</p>
			<p class="text-xl lg:w-[720px]">
				Finding the right talent can be a challenge&mdash;and that's just a fact of life. But that's
				where we come in.
			</p>
		</article>
		<call-to-action
			class="flex w-full flex-col items-center justify-center gap-4 self-stretch rounded-lg border border-slate-300 p-8 text-center"
		>
			<p class="w-full text-5xl font-semibold lg:w-[775px] lg:text-6xl">What we do to fix this?</p>
			<p class="text-xl lg:w-[720px]">
				Our platform is designed to help employers connect with the perfect candidates quickly and
				effortlessly. With just one glance, you'll discover the skilled professionals you need to
				bring your vision to life. Register as a host below.
			</p>
		</call-to-action>
	</page-content>
</page>

<footer
	class="flex flex-col lg:flex-row w-full items-start lg:items-center justify-start lg:justify-center gap-20 self-stretch border-t border-slate-300 bg-slate-50 px-16 py-8"
>
	<frame-1 class="flex flex-[2] flex-col items-start gap-4">
		<about-us class="flex lg:w-5/12 flex-col items-start gap-2">
			<Logo />
			<p>
				talentpool connects you with people in tech from all around Belize quickly and effortlessly.
				Join our community and select from our growing selection of candidates today :)
			</p>
		</about-us>
		<Button
			onclick={() => goto('/auth/login')}
			class="flex w-fit items-center justify-center gap-2"
		>
			<Mail />
			<p>Login with email</p>
		</Button>
	</frame-1>
	<frame-2 class="flex flex-1 flex-col items-center justify-start lg:justify-between">
		<nav class="w-full">
			<ul class="flex flex-col lg:flex-row w-full gap-4 items-start justify-start lg:justify-between">
				<li>
					<p class="text-md font-medium">Product</p>
					<ul>
						<li>
							<a href="/auth/login">Login</a>
						</li>
						<li>
							<a href="/auth/register">Register</a>
						</li>
					</ul>
				</li>

				<li>
					<p class="text-md font-medium">Directory</p>
					<ul>
						<li>
							<a href="/archive/interns">Interns</a>
						</li>
					</ul>
				</li>
				<li>
					<p class="text-md font-medium">Contact</p>
					<ul>
						<li>
							<a href="mailto:2022156465@ub.edu.bz">2022156465@ub.edu.bz</a>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	</frame-2>
</footer>
