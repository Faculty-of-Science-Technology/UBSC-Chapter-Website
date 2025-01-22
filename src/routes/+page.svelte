<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as TabList from '$lib/components/vendor/ui/tablist/index';
	import { CheckSquare, Mail, Rocket } from 'lucide-svelte';
	// import * as m from '$lib/paraglide/messages.js';

	let active_tab = $state(0);
</script>

<page class="m-3 flex flex-col gap-24 lg:mx-20 lg:mt-9">
	<TabList.Root class="space-x-8 items-stretch">
		<TabList.Tab title="Home" onclick={() => (active_tab = 0)} active={active_tab === 0} />
		<TabList.Tab title="Interns" onclick={() => (active_tab = 1)} active={active_tab === 1} />
		<TabList.Tab title="Presentation Agenda" onclick={() => (active_tab = 2)} active={active_tab === 2} />
		<TabList.Tab title="Host Organizations" onclick={() => (active_tab = 3)} active={active_tab === 3} />
		<TabList.Tab title="About" onclick={() => (active_tab = 4)} active={active_tab === 4} />
	</TabList.Root>
	<article
		class="flex w-full flex-col items-start justify-center gap-4 self-stretch rounded-lg p-8 text-left"
	>
		<h1 class="w-full text-3xl font-semibold lg:w-[775px] lg:text-6xl">
			We understand. Hiring people is a tricky task.
		</h1>
		<p class="text-xl lg:w-[720px]">
			Finding the right talent can be a challenge&mdash;and that's just a fact of life. But that's
			where we come in.
		</p>
	</article>
	<call-to-action
		class="flex w-full flex-col items-center justify-center gap-4 self-stretch rounded-lg border border-slate-300 p-8 text-center"
	>
		<h1 class="w-full text-5xl font-semibold lg:w-[775px] lg:text-6xl">What we do to fix this?</h1>
		<p class="text-xl lg:w-[720px]">
			Our platform is designed to help employers connect with the perfect candidates quickly and
			effortlessly. With just one glance, you'll discover the skilled professionals you need to
			bring your vision to life. Register as a host below.
		</p>
		<a href="/auth/register">
			<Button class="w-fit">Register as a Host</Button>
		</a>
	</call-to-action>
	<hero class="flex flex-col items-center justify-center">
		<options-container
			class="space-between flex-start flex w-full flex-col gap-4 text-5xl font-extralight lg:flex-row lg:text-5xl"
		>
			<kickstart-career
				class="flex flex-1 flex-col items-start gap-4 self-stretch rounded-lg border border-slate-300 p-4 lg:border-0"
			>
				<Rocket size="84" strokeWidth="1" />
				<h2>Kickstart Your <span class="font-medium underline">Career</span></h2>
				<p class="text-inter text-xl font-medium">Find your next job</p>
				<a href="/auth/register">
					<Button class="w-fit">Register as an Intern</Button>
				</a>
			</kickstart-career>
			<acquire-talent
				class="flex flex-1 flex-col items-start gap-4 self-stretch border border-slate-300 p-4 lg:border-0"
			>
				<CheckSquare size="84" strokeWidth="1" />
				<h2>Acquire <span class="font-medium underline">Talent</span></h2>
				<p class="text-inter text-xl font-medium">Because, why look anywhere else?</p>
				<a href="/auth/register">
					<Button class="w-fit">Register as a Host</Button>
				</a>
			</acquire-talent>
		</options-container>
	</hero>
	<page-content class="flex flex-col items-start gap-12">
		<call-to-action
			class="flex w-full flex-col items-center justify-center gap-4 self-stretch rounded-lg border border-slate-300 p-8 text-center"
		>
			<h1 class="w-full text-5xl font-semibold lg:w-[775px] lg:text-6xl">
				Not <span class="italic">JUST</span> your typical hiring platform.
			</h1>
			<p class="text-xl lg:w-[720px]">
				We connect you with people in tech from all around Belize quickly and effortlessly. Join our
				community and select from our growing selection of candidates today!
			</p>
		</call-to-action>
	</page-content>
</page>

<footer
	class="flex w-full flex-col items-start justify-start gap-20 self-stretch border-t border-slate-300 bg-slate-50 px-16 py-8 lg:flex-row lg:items-center lg:justify-center"
>
	<frame-1 class="flex flex-[2] flex-col items-start gap-4">
		<about-us class="flex flex-col items-start gap-2 lg:w-5/12">
			<Logo />
			<p>
				talentpool connects you with people in tech from all around Belize quickly and effortlessly.
				Join our community and select from our growing selection of candidates today :)
			</p>
		</about-us>
		<a href="/auth/login">
			<Button class="flex w-fit items-center justify-center gap-2">
				<Mail />
				<p>Login with email</p>
			</Button>
		</a>
	</frame-1>
	<frame-2 class="flex flex-1 flex-col items-center justify-start lg:justify-between">
		<nav class="w-full">
			<ul
				class="flex w-full flex-col items-start justify-start gap-4 lg:flex-row lg:justify-between"
			>
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
