<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { Homepage, type AvatarData } from '$lib/assemblies/index';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import * as TabList from '$lib/components/vendor/ui/tablist/index';
	import { Briefcase, Calendar, FileCheck, Mail, MapPin, Phone, User, Video } from 'lucide-svelte';

	import { page } from '$app/state';
	import {
		PUBLIC_PLATFORM_NAME,
		PUBLIC_PLATFORM_SPONSOR_NAME,
		PUBLIC_SUPPORT_EMAIL
	} from '$env/static/public';
	import PartnerOrgs from '$lib/components/homepage/PartnerOrgs.svelte';

	import { superForm } from 'sveltekit-superforms/client';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const org_avatar_data: AvatarData[] = data.org_avatar_data;
	const agenda_data = data.agendas;

	const forced_tab = page.url.searchParams.get('tab')
		? parseInt(page.url.searchParams.get('tab') ?? '0')
		: null;

	let active_tab = $state(forced_tab ?? 0);

	const { form, errors, constraints, message, enhance } = superForm(data.form);

	let loadingBar: HTMLDivElement;
	let mobileMenuOpen = $state(false);

	beforeNavigate(() => {
		loadingBar.style.opacity = '1';
	});

	afterNavigate(() => {
		setTimeout(() => {
			loadingBar.classList.add('animate-fade-out');
		}, 1115);
		setTimeout(() => {
			loadingBar.style.opacity = '0';
			loadingBar.classList.remove('animate-fade-out');
		}, 1125);
		mobileMenuOpen = false;
	});

	// Format date function
	const formatDate = (date: string | Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	};
	const formatTime = (date: Date) => {
		return new Date(date.toJSON().toString()).toLocaleTimeString('en-US', {
			timeZone: 'UTC'
		});
	};
</script>

<div
	bind:this={loadingBar}
	class="loading-bar overflow-clip"
	style="height: 3px; width: 100%; position: fixed; top: 0; right: 0; opacity: 0; z-index: 1000"
>
	<div style="height: 3px; animation: loading2 3s ease-out 1" class="loading-gradient-2">
		<div
			style="height: 3px; animation: loading 3s ease-out infinite"
			class="loading-gradient w-full origin-right delay-0 duration-1000 ease-linear"
		></div>
	</div>
</div>

<!-- Main layout with navbar styling similar to the dashboard -->
<div class="flex min-h-screen flex-col overflow-hidden bg-background">
	<!-- Navbar -->
	<nav class="sticky top-0 z-40 border-b bg-background px-4 py-2 shadow-sm">
		<div class="container mx-auto flex items-center justify-between">
			<div class="flex items-center gap-2">
				<a href="/" class="flex items-center gap-2">
					<Logo />
				</a>
			</div>

			<!-- Navigation tabs as buttons on larger screens -->
			<div class="hidden items-center gap-4 lg:flex">
				<div class="flex gap-2">
					<TabList.Root class="items-stretch space-x-8">
						<TabList.Tab
							class="px-3 py-2 text-muted-foreground hover:text-foreground"
							title="Home"
							onclick={() => (active_tab = 0)}
							active={active_tab === 0}
						/>
						<TabList.Tab
							class="px-3 py-2 text-muted-foreground hover:text-foreground"
							title="IT Talent"
							onclick={() => (active_tab = 1)}
							active={active_tab === 1}
						/>
						<TabList.Tab
							class="px-3 py-2 text-muted-foreground hover:text-foreground"
							title="Presentation Agenda"
							onclick={() => (active_tab = 2)}
							active={active_tab === 2}
						/>
						<TabList.Tab
							class="px-3 py-2 text-muted-foreground hover:text-foreground"
							title="Host Organizations"
							onclick={() => (active_tab = 3)}
							active={active_tab === 3}
						/>
						<TabList.Tab
							class="px-3 py-2 text-muted-foreground hover:text-foreground"
							title="About"
							onclick={() => (active_tab = 4)}
							active={active_tab === 4}
						/>
						<TabList.Tab
							class="px-3 py-2 text-muted-foreground hover:text-foreground"
							title="Archives"
							onclick={() => (active_tab = 5)}
							active={active_tab === 5}
						/>
					</TabList.Root>
				</div>
				<div class="ml-4 flex flex-row gap-2">
					{#if data.authenticated}
						<a href="/dashboard">
							<Button variant="outline">Dashboard</Button>
						</a>
						<a href="/auth/logout" data-sveltekit-reload>
							<Button variant="default">Logout</Button>
						</a>
					{:else}
						<a href="/auth/login" data-sveltekit-reload>
							<Button variant="outline">Login</Button>
						</a>
						<a href="/auth/register">
							<Button variant="default">Register Now</Button>
						</a>
					{/if}
				</div>
			</div>

			<!-- Mobile menu button -->
			<button class="lg:hidden" onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
				{#if mobileMenuOpen}
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<!-- Mobile menu - shown only when toggled -->
		<div class="mt-2 lg:hidden" class:hidden={!mobileMenuOpen}>
			<div class="space-y-1 px-2 pb-3 pt-2">
				<TabList.Root class="flex flex-col gap-1">
					<TabList.Tab
						title="Home"
						onclick={() => (active_tab = 0)}
						active={active_tab === 0}
						class="rounded-md px-3 py-2"
					/>
					<TabList.Tab
						title="IT Talent"
						onclick={() => (active_tab = 1)}
						active={active_tab === 1}
						class="rounded-md px-3 py-2"
					/>
					<TabList.Tab
						title="Presentation Agenda"
						onclick={() => (active_tab = 2)}
						active={active_tab === 2}
						class="rounded-md px-3 py-2"
					/>
					<TabList.Tab
						title="Host Organizations"
						onclick={() => (active_tab = 3)}
						active={active_tab === 3}
						class="rounded-md px-3 py-2"
					/>
					<TabList.Tab
						title="About"
						onclick={() => (active_tab = 4)}
						active={active_tab === 4}
						class="rounded-md px-3 py-2"
					/>
					<TabList.Tab
						title="Archives"
						onclick={() => (active_tab = 5)}
						active={active_tab === 5}
						class="rounded-md px-3 py-2"
					/>
				</TabList.Root>
				<div class="mt-4 flex flex-col gap-2">
					{#if data.authenticated}
						<a href="/dashboard"><Button variant="outline" class="w-full">Dashboard</Button></a>
						<a href="/auth/logout" data-sveltekit-reload
							><Button variant="default" class="w-full">Logout</Button></a
						>
					{:else}
						<a href="/auth/login" data-sveltekit-reload
							><Button variant="outline" class="w-full">Login</Button></a
						>
						<a href="/auth/register"
							><Button variant="default" class="w-full">Register Now</Button></a
						>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main content -->
	<main class="flex-1 overflow-y-auto">
		<!-- Tab content -->
		<div class="container mx-auto p-4 md:p-6">
			<div class="tab-content">
				{#if active_tab === 0}
					<!-- Hero Section -->
					<section class="mb-10">
						<div
							class="rounded-lg bg-gradient-to-r from-primary/5 via-primary/5 to-primary/10 p-6 shadow-sm"
						>
							<div class="flex flex-col-reverse gap-8 lg:flex-row lg:items-center lg:gap-12">
								<div class="lg:w-7/12">
									<!--- Institution card --->
									<div
										class="mb-6 rounded-md border bg-card p-4 shadow-sm transition-all hover:shadow"
									>
										<div class="flex items-center gap-4">
											<div class="h-12 w-12 overflow-hidden rounded-full border-2 border-muted">
												<img
													class="h-full w-full object-cover"
													alt="University of Belize"
													src="https://avatars.githubusercontent.com/u/168884004"
												/>
											</div>
											<div>
												<h4 class="text-base font-medium">University of Belize</h4>
												<p class="text-sm text-muted-foreground">Education Empowers a Nation</p>
											</div>
										</div>
									</div>
									<!-- End institution card -->

									<h1 class="mb-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
										Welcome to the University of Belize IT Talent Network
									</h1>
									<p class="mb-6 text-lg text-muted-foreground">
										Connecting UB's Brightest Minds with the Tech Industry
									</p>

									<p class="mb-6 max-w-3xl text-muted-foreground">
										Welcome to the University of Belize's exclusive online portal for IT talent.
										Whether you're looking for bright interns or experienced alumni, this is your
										direct link to a growing network of skilled professionals from the UB IT
										program.
									</p>

									<div class="mb-6">
										<h4 class="mb-3 font-medium">What You'll Find:</h4>
										<ul class="ml-5 list-disc space-y-2 text-muted-foreground">
											<li class="flex items-start gap-2">
												<span class="mt-1 text-primary">•</span>
												<span>Profiles and resumes of current IT students and graduates</span>
											</li>
											<li class="flex items-start gap-2">
												<span class="mt-1 text-primary">•</span>
												<span>A curated community of tech professionals educated at UB</span>
											</li>
											<li class="flex items-start gap-2">
												<span class="mt-1 text-primary">•</span>
												<span
													>Quick, seamless connection with candidates ready to make an impact</span
												>
											</li>
										</ul>
									</div>

									<div class="mb-6 flex flex-wrap gap-3">
										<a href="/auth/register">
											<Button class="transition-all hover:shadow">Register as an Intern</Button>
										</a>
										<a href="/auth/register?force_choice=host">
											<Button variant="outline" class="transition-all hover:bg-primary/10"
												>Register as an Employer</Button
											>
										</a>
									</div>

									<!-- Partner orgs -->
									<div class="mt-5">
										<PartnerOrgs {org_avatar_data}>
											<a href="#host-organizations" onclick={() => (active_tab = 3)}>
												<p
													class="mt-4 text-sm font-medium text-primary opacity-80 hover:opacity-100"
												>
													See more partner organizations →
												</p>
											</a>
										</PartnerOrgs>
									</div>
								</div>
								<!-- Image hidden on mobile, shown on lg screens -->
								<div class="hidden lg:block lg:w-5/12">
									<div class="overflow-hidden rounded-lg border bg-card shadow-sm">
										<img
											src="/static/featured/Zyon_Morter.jpg"
											alt="Featured Intern"
											class="h-auto w-full object-cover"
										/>
										<div class="p-2 text-left text-xs italic text-muted-foreground">
											Photo: Zyon Morter &mdash; Past Intern
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<!-- Registration and Calendar Section -->
					<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<!-- Registration Card -->
						<Card.Root class="card-hover-effect transition-all hover:shadow-md">
							<Card.Header>
								<Card.Title>Register For The Event</Card.Title>
								<Card.Description>
									Sign up to attend our upcoming internship presentations and connect with talented
									IT students.
								</Card.Description>
							</Card.Header>
							<Card.Content>
								<form
									class="flex flex-col gap-4"
									action="?/signUpForDefaultEvent"
									method="POST"
									use:enhance
								>
									<div>
										<label for="name" class="mb-1 block text-sm font-medium">Your name</label>
										<p class="text-xs text-destructive">{$errors.name}</p>
										<input
											type="text"
											class="w-full rounded-md border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
											id="name"
											name="name"
											bind:value={$form.name}
											{...$constraints.name}
											placeholder="Your Name"
											required
										/>
									</div>
									<div>
										<label for="email" class="mb-1 block text-sm font-medium">Email Address</label>
										<p class="text-xs text-destructive">{$errors.email}</p>
										<input
											type="email"
											class="w-full rounded-md border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
											id="email"
											name="email"
											bind:value={$form.email}
											{...$constraints.email}
											placeholder="Email Address"
											required
										/>
									</div>
									{#if $message}
										<p class="text-sm text-success">{$message}</p>
									{/if}
									{#if $errors._errors}
										<p class="text-sm text-destructive">{$errors._errors}</p>
									{/if}
									<Button type="submit" class="mt-2 w-full transition-all hover:shadow"
										>Register for the event</Button
									>
								</form>
							</Card.Content>
						</Card.Root>

						<!-- Calendar Events Card -->
						<Card.Root class="card-hover-effect transition-all hover:shadow-md">
							<Card.Header>
								<Card.Title>Upcoming Presentations</Card.Title>
							</Card.Header>
							<Card.Content>
								<ul class="space-y-4">
									{#each agenda_data.slice(0, 2) as group}
										{#if group.agenda !== null}
											<li>
												<div class="flex items-start gap-3">
													<div class="rounded-full bg-primary/10 p-2 text-primary">
														<Calendar size={18} />
													</div>
													<div>
														<p class="font-medium">{group.agenda.Title}</p>
														<p class="text-sm text-muted-foreground">
															{#if group.agenda.StartTime.toJSON().toString() !== group.agenda.EndTime.toJSON().toString()}
																{formatDate(group.agenda.StartTime)} - {formatDate(
																	group.agenda.EndTime
																)}
															{:else}
																{formatDate(group.agenda.StartTime)}
															{/if}
															&bull;
															<span
																>{formatTime(group.agenda.StartTime)} - {formatTime(
																	group.agenda.EndTime
																)}</span
															>
														</p>
														<p class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
															<MapPin size={12} />
															<span>Belmopan Campus / Online</span>
														</p>
													</div>
												</div>
											</li>
										{/if}
									{/each}
								</ul>
							</Card.Content>
							<Card.Footer class="pt-2">
								<a href="/?tab=2" class="text-xs font-medium text-primary hover:underline">
									View full schedule →
								</a>
							</Card.Footer>
						</Card.Root>

						<!-- Join Online Card -->
						<Card.Root class="card-hover-effect transition-all hover:shadow-md">
							<Card.Header>
								<Card.Title>Join Us Online</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex items-center gap-3">
									<div class="rounded-full bg-primary/10 p-2 text-primary">
										<Video size={18} />
									</div>
									<div>
										<p class="font-medium">Zoom Meeting</p>
										<a
											href="https://us06web.zoom.us/j/86803449142"
											class="text-sm text-primary hover:underline"
										>
											Click to join the meeting
										</a>
									</div>
								</div>
								<div class="mt-4 flex justify-center">
									<div class="rounded-lg border bg-background p-2 shadow-sm">
										<img
											class="h-32 w-32"
											alt="QR Code for Zoom Meeting"
											src="/static/featured/zoom_meeting.svg"
										/>
									</div>
								</div>
								<p class="mt-4 text-center text-xs text-muted-foreground">
									Scan QR code with your smartphone to join instantly
								</p>
							</Card.Content>
						</Card.Root>
					</div>

					<!-- Explore Interns Accomplishments Section -->
					<section class="mb-8 mt-8">
						<div
							class="rounded-lg bg-gradient-to-r from-primary/90 to-primary p-6 text-primary-foreground shadow-sm"
						>
							<h2 class="mb-4 text-2xl font-bold">EXPLORE WHAT OUR INTERNS HAVE ACCOMPLISHED</h2>
							<p class="mb-6 max-w-3xl">
								Come explore the diverse experiences and contributions of our final-year IT interns
								— from both the Associate and Bachelor programs — as they present insights from
								their recently completed internships. This event showcases the skills, growth, and
								professional development of tomorrow's tech leaders.
							</p>

							<div class="flex flex-col gap-6 sm:flex-row">
								<a
									href="/?tab=2"
									class="card-hover-effect flex-1 rounded-lg border border-white/30 bg-white/10 p-4 transition-all hover:bg-white/20 hover:shadow-md"
								>
									<div class="flex items-center gap-3">
										<div class="rounded-full bg-white/20 p-2">
											<Calendar size={20} class="text-white" />
										</div>
										<p class="font-bold">See Presentation Details</p>
									</div>
									<div class="mt-2 text-sm">
										View the full schedule and learn more about the upcoming presentations
									</div>
								</a>

								<a
									href="/auth/register"
									class="card-hover-effect flex-1 rounded-lg border border-white/30 bg-white/10 p-4 transition-all hover:bg-white/20 hover:shadow-md"
								>
									<div class="flex items-center gap-3">
										<div class="rounded-full bg-white/20 p-2">
											<FileCheck size={20} class="text-white" />
										</div>
										<p class="font-bold">Register as an Organization</p>
									</div>
									<div class="mt-2 text-sm">
										Join our platform to connect with UB's top IT talent
									</div>
								</a>
							</div>
						</div>
					</section>

					<!-- Options Cards Grid -->
					<section class="mb-10 mt-8">
						<div class="mb-6">
							<h2 class="mb-2 text-2xl font-medium">Let's Get You Connected</h2>
							<p class="max-w-3xl text-muted-foreground">
								Whether you're launching your career or building a team, start here.
							</p>
						</div>

						<div class="grid gap-6 md:grid-cols-2">
							<Card.Root class="card-hover-effect transition-all hover:shadow-md">
								<Card.Content class="p-6">
									<div class="flex h-full flex-col">
										<div class="mb-4 w-fit rounded-full bg-primary/10 p-4">
											<User size={28} class="text-primary" />
										</div>
										<h3 class="mb-2 text-xl font-medium">
											For <span class="font-semibold">Students & Alumni</span>
										</h3>
										<p class="mb-4 text-muted-foreground">
											Launch Your Tech Career with Confidence
										</p>
										<p class="mb-4 text-sm">
											Join UB's exclusive network of IT professionals. Whether you're preparing for
											your first internship or seeking new opportunities, this platform puts your
											profile in front of real employers.
										</p>
										<div class="mb-6">
											<p class="mb-2 font-medium">Why Join:</p>
											<ul class="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
												<li>Build your professional profile and showcase your work</li>
												<li>Be visible to top employers hiring tech talent</li>
												<li>Access exclusive internship and job opportunities</li>
											</ul>
										</div>
										<div class="mt-auto pt-4">
											<a href="/auth/register">
												<Button class="transition-all hover:shadow">Create Your Profile</Button>
											</a>
										</div>
									</div>
								</Card.Content>
							</Card.Root>

							<Card.Root class="card-hover-effect transition-all hover:shadow-md">
								<Card.Content class="p-6">
									<div class="flex h-full flex-col">
										<div class="mb-4 w-fit rounded-full bg-primary/10 p-4">
											<Briefcase size={28} class="text-primary" />
										</div>
										<h3 class="mb-2 text-xl font-medium">
											For <span class="font-semibold">Employers</span>
										</h3>
										<p class="mb-4 text-muted-foreground">Connect with UB's Tech Talent</p>
										<p class="mb-4 text-sm">
											Looking for skilled interns or graduates in IT? This is your direct link to
											the University of Belize's top talent — trained in theory, practice, and
											innovation.
										</p>
										<div class="mb-6">
											<p class="mb-2 font-medium">What You Get:</p>
											<ul class="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
												<li>Access to curated profiles of UB IT students and alumni</li>
												<li>A streamlined path to recruit the right talent for your team</li>
												<li>Connect directly with qualified candidates</li>
											</ul>
										</div>
										<div class="mt-auto pt-4">
											<a href="/auth/register?force_choice=host">
												<Button variant="outline" class="transition-all hover:bg-primary/10"
													>Register as an Employer</Button
												>
											</a>
										</div>
									</div>
								</Card.Content>
							</Card.Root>
						</div>
					</section>
				{:else if active_tab === 1}
					<Homepage.Interns avatar_data={data.avatar_data} group_data={data.groups} />
				{:else if active_tab === 2}
					<Homepage.PresentationAgenda {agenda_data} />
				{:else if active_tab === 3}
					<Homepage.HostOrganizations avatar_data={org_avatar_data} />
				{:else if active_tab === 4}
					<Homepage.About />
				{:else if active_tab === 5}
					<Homepage.Archives />
				{/if}
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="border-t bg-background py-8 shadow-sm">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
				<!-- Logo and about section -->
				<div class="lg:col-span-5">
					<div class="mb-4 flex items-center gap-2">
						<Logo />
					</div>
					<p class="mb-6 max-w-md text-muted-foreground">
						IT Careers connects employers with emerging and experienced tech talent from the
						University of Belize — quickly, easily, and all in one place. Join our growing network
						today.
					</p>
					<div class="flex gap-3">
						<a href="/auth/login">
							<Button
								variant="outline"
								size="sm"
								class="flex items-center gap-2 transition-all hover:bg-primary/10"
							>
								<Mail size={14} />
								<span>Login</span>
							</Button>
						</a>
						<a href="/auth/register">
							<Button size="sm" class="transition-all hover:shadow">Register</Button>
						</a>
					</div>
				</div>

				<!-- Links section -->
				<div class="lg:col-span-3">
					<h3 class="mb-4 text-sm font-medium">Sitemap</h3>
					<ul class="grid gap-2 text-sm">
						<li>
							<a
								href="/"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>Home</a
							>
						</li>
						<li>
							<a
								href="/?tab=1"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>Interns</a
							>
						</li>
						<li>
							<a
								href="/?tab=2"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>Presentation Agenda</a
							>
						</li>
						<li>
							<a
								href="/?tab=3"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>Host Organizations</a
							>
						</li>
						<li>
							<a
								href="/?tab=4"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>About</a
							>
						</li>
						<li>
							<a
								href="/auth/login"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>Login</a
							>
						</li>
						<li>
							<a
								href="/auth/register"
								class="text-muted-foreground transition-colors hover:text-foreground"
								data-sveltekit-reload>Register</a
							>
						</li>
					</ul>
				</div>

				<!-- Contact section -->
				<div class="lg:col-span-4">
					<h3 class="mb-4 text-sm font-medium">Contact</h3>
					<ul class="space-y-4">
						<li class="flex items-start gap-3">
							<div class="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
								<MapPin size={14} />
							</div>
							<p class="text-sm text-muted-foreground">Hummingbird Avenue, Belmopan, Belize</p>
						</li>
						<li class="flex items-start gap-3">
							<div class="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
								<Phone size={14} />
							</div>
							<p class="text-sm text-muted-foreground">(501) 822-1000</p>
						</li>
						<li class="flex items-start gap-3">
							<div class="mt-0.5 rounded-full bg-primary/10 p-1.5 text-primary">
								<Mail size={14} />
							</div>
							<a
								href="mailto:{PUBLIC_SUPPORT_EMAIL}"
								class="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{PUBLIC_SUPPORT_EMAIL}
							</a>
						</li>
					</ul>
				</div>
			</div>

			<!-- Copyright -->
			<div class="mt-10 border-t border-muted pt-6 text-center">
				<p class="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()}
					{PUBLIC_PLATFORM_NAME} Platform {PUBLIC_PLATFORM_SPONSOR_NAME} | All rights reserved
				</p>
			</div>
		</div>
	</footer>
</div>

<!-- View transition animations -->
<style>
	/* Add fade-in animation for page transitions */
	main {
		view-transition-name: main-content;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(15px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	section {
		animation: fadeIn 0.4s ease-out;
	}

	.tab-content {
		animation: slideIn 0.3s ease-out;
	}

	.card-hover-effect {
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.card-hover-effect:hover,
	.card-hover-effect:focus-within {
		transform: translateY(-2px);
	}

	/* Improve focus styles for accessibility */
	a:focus,
	button:focus {
		outline: 2px solid transparent;
		outline-offset: 2px;
		box-shadow: 0 0 0 2px rgba(147, 85, 139, 0.3);
	}
</style>
