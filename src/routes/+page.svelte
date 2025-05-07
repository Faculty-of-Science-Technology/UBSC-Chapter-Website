<script lang="ts">
	import { Homepage, type AvatarData } from '$lib/assemblies/index';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as TabList from '$lib/components/vendor/ui/tablist/index';
	import { Calendar, CheckSquare, Mail, MapPin, Phone, Rocket, Video } from 'lucide-svelte';

	import { page } from '$app/state';
	import {
		PUBLIC_PLATFORM_NAME,
		PUBLIC_PLATFORM_SPONSOR_NAME,
		PUBLIC_SUPPORT_EMAIL
	} from '$env/static/public';
	import PartnerOrgs from '$lib/components/homepage/PartnerOrgs.svelte';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const org_avatar_data: AvatarData[] = data.org_avatar_data;
	const agenda_data = data.agendas;

	const forced_tab = page.url.searchParams.get('tab')
		? parseInt(page.url.searchParams.get('tab') ?? '0')
		: null;

	let active_tab = $state(forced_tab ?? 0);
</script>

<!-- Main layout with navbar styling similar to the reference -->
<div class="flex min-h-screen flex-col">
	<!-- Navbar -->
	<nav class="border-b border-amber-200 bg-white px-4 py-2 shadow-sm">
		<div class="container mx-auto flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<Logo />
			</a>

			<!-- Navigation tabs as buttons on larger screens -->
			<div class="hidden items-center gap-4 lg:flex">
				<div class="flex gap-2">
					<TabList.Root class="items-stretch space-x-8">
						<TabList.Tab
							class="px-3 py-2 text-gray-700 hover:text-violet-700"
							title="Home"
							onclick={() => (active_tab = 0)}
							active={active_tab === 0}
						/>
						<TabList.Tab
							class="px-3 py-2 text-gray-700 hover:text-violet-700"
							title="IT Talent"
							onclick={() => (active_tab = 1)}
							active={active_tab === 1}
						/>
						<TabList.Tab
							class="px-3 py-2 text-gray-700 hover:text-violet-700"
							title="Presentation Agenda"
							onclick={() => (active_tab = 2)}
							active={active_tab === 2}
						/>
						<TabList.Tab
							class="px-3 py-2 text-gray-700 hover:text-violet-700"
							title="Host Organizations"
							onclick={() => (active_tab = 3)}
							active={active_tab === 3}
						/>
						<TabList.Tab
							class="px-3 py-2 text-gray-700 hover:text-violet-700"
							title="About"
							onclick={() => (active_tab = 4)}
							active={active_tab === 4}
						/>
						<TabList.Tab
							class="px-3 py-2 text-gray-700 hover:text-violet-700"
							title="Archives"
							onclick={() => (active_tab = 5)}
							active={active_tab === 5}
						/>
					</TabList.Root>
				</div>
				<div class="ml-4 flex flex-row gap-2">
					{#if data.authenticated}
						<a href="/dashboard">
							<Button class="bg-amber-500 text-white hover:bg-amber-600">Dash</Button>
						</a>
						<a href="/auth/logout" data-sveltekit-reload>
							<Button class="bg-violet-500 text-white hover:bg-violet-600">Logout</Button>
						</a>
					{:else}
						<a href="/auth/login"
							><Button class="bg-violet-500 text-white hover:bg-violet-600" data-sveltekit-reload
								>Login</Button
							></a
						>
						<a href="/auth/register">
							<Button class="bg-amber-500 text-white hover:bg-amber-600">Register Now</Button>
						</a>
					{/if}
				</div>
			</div>

			<!-- Mobile menu button -->
			<button class="lg:hidden">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>

		<!-- Mobile tabs - shown only on small screens -->
		<div class="mt-2 overflow-x-auto pb-2 lg:hidden">
			<TabList.Root class="flex gap-2 px-4">
				<TabList.Tab title="Home" onclick={() => (active_tab = 0)} active={active_tab === 0} />
				<TabList.Tab title="IT Talent" onclick={() => (active_tab = 1)} active={active_tab === 1} />
				<TabList.Tab
					title="Presentation Agenda"
					onclick={() => (active_tab = 2)}
					active={active_tab === 2}
				/>
				<TabList.Tab
					title="Host Organizations"
					onclick={() => (active_tab = 3)}
					active={active_tab === 3}
				/>
				<TabList.Tab title="About" onclick={() => (active_tab = 4)} active={active_tab === 4} />
				<TabList.Tab title="Archives" onclick={() => (active_tab = 5)} active={active_tab === 5} />
			</TabList.Root>
		</div>
	</nav>

	<!-- Main content -->
	<main class="flex-1">
		<!-- Tab content -->
		<div class="py-4">
			{#if active_tab === 0}
				<!-- Hero Section -->
				<section class="container mx-auto px-4 py-12">
					<div class="flex flex-col-reverse items-center gap-8 lg:flex-row lg:gap-12">
						<div class="lg:w-7/12">
							<div class="mb-6 flex flex-col gap-3">
								<!--- hydrocode card --->

								<div class="rounded-md border-2 border-yellow-400 bg-white px-4 pb-4">
									<div class="mt-4 flex">
										<!-- Avatar -->
										<div class="flex-shrink-0">
											<a
												href="https://github.com/faculty-of-science-technology"
												aria-label="UniversityOfBelize"
											>
												<img
													class="h-11 w-11 rounded-full border-2 border-gray-200"
													alt="University of Belize"
													src="https://avatars.githubusercontent.com/u/168884004"
												/>
											</a>
										</div>

										<!-- Info Block -->
										<div class="ml-4 flex-grow overflow-hidden">
											<div class="flex items-center space-x-1">
												<a
													href="https://github.com/faculty-of-science-technology"
													class="text-base font-semibold text-blue-600 hover:underline"
												>
													University of Belize
												</a>
												<a
													href="https://github.com/faculty-of-science-technology"
													class="text-sm text-gray-500 hover:underline"
												>
													@Faculty-of-Science-Technology
												</a>
											</div>
											<p class="mt-1 text-sm leading-snug text-gray-600">
												Education Empowers a Nation
											</p>
										</div>
									</div>
								</div>
								<!-- End hydrocode card -->
								<h1 class="text-center text-4xl font-bold text-gray-900 lg:text-left lg:text-5xl">
									Welcome to the University of Belize IT Talent Network
								</h1>
								<p class="text-slate-600">
									Connecting UB&#39;s Brightest Minds with the Tech Industry
								</p>
							</div>
							<p class="text-lg text-gray-700">
								Welcome to the University of Belize's exclusive online portal for IT talent. Whether
								you're looking for bright interns or experienced alumni, this is your direct link to
								a growing network of skilled professionals from the UB IT program.
							</p>
							<div class="mt-4 text-lg text-gray-700">
								<span class="font-semibold">What You'll Find:</span>
								<ul class="ml-5 mt-2 list-disc space-y-1">
									<li>Profiles and resumes of current IT students and graduates</li>
									<li>A curated community of tech professionals educated at UB</li>
									<li>Quick, seamless connection with candidates ready to make an impact</li>
								</ul>
							</div>
							<div class="mt-8 flex justify-center lg:justify-start">
								<a href="/auth/register">
									<Button class="bg-violet-600 text-white hover:bg-violet-700"
										>Register as an Intern</Button
									>
								</a>
								<a href="/auth/register?force_choice=host" class="ml-4">
									<Button class="bg-amber-500 text-white hover:bg-amber-600"
										>Register as a Host</Button
									>
								</a>
							</div>
							<!-- Partner orgs -->
							<div class="mt-3 block opacity-75">
								<PartnerOrgs {org_avatar_data}>
									<a href="#host-organizations" onclick={() => (active_tab = 3)}>
										<p class="mt-4 text-sm text-violet-800 opacity-60">
											See more partner organizations
										</p>
									</a>
								</PartnerOrgs>
							</div>
						</div>
						<div class="lg:w-5/12">
							<div class="overflow-hidden rounded-lg">
								<img
									src="/static/featured/Zyon_Morter.jpg"
									alt="Featured Intern"
									class="h-auto w-full rounded-lg object-cover"
								/>
								<div class="mt-2 text-left italic text-gray-400">
									Photo: Zyon Morter &mdash; Past Intern
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Registration Section -->
				<section class="bg-gradient-to-r from-violet-700 to-fuchsia-600 py-16 text-white">
					<div class="container mx-auto px-4">
						<div class="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
							<div class="lg:w-7/12">
								<h2 class="mb-6 text-4xl font-bold">EXPLORE WHAT OUR INTERNS HAVE ACCOMPLISHED</h2>
								<p class="mb-8 text-xl">
									Come explore the diverse experiences and contributions of our final-year IT
									interns — from both the Associate and Bachelor programs — as they present insights
									from their recently completed internships. This event showcases the skills,
									growth, and professional development of tomorrow's tech leaders.
								</p>

								<div class="flex flex-col gap-6 sm:flex-row">
									<div class="rounded-lg border border-white/30 bg-white/10 p-4">
										<p class="font-bold">Associates Presentation</p>
										<a href="#" class="flex items-center gap-2 text-white hover:underline">
											<Calendar size={20} />
											<span>May 8, 2025</span>
										</a>
									</div>

									<div class="rounded-lg border border-white/30 bg-white/10 p-4">
										<p class="font-bold">Bachelors Presentation</p>
										<a href="#" class="flex items-center gap-2 text-white hover:underline">
											<Calendar size={20} />
											<span>May 9, 2025</span>
										</a>
									</div>
								</div>
							</div>

							<div class="w-full lg:w-5/12">
								<div class="rounded-lg bg-white p-6 text-gray-800 shadow-lg">
									<h3 class="mb-2 text-2xl font-bold text-violet-800">Register</h3>
									<p class="mb-6 text-gray-600">Sign up to attend the intern's presentation.</p>

									<form
										class="flex flex-col gap-4"
										action="/auth/register?/register&force_choice=host"
										method="POST"
									>
										<div>
											<label for="full_name" class="mb-1 block text-sm font-medium"
												>Organization</label
											>
											<input
												type="text"
												class="w-full rounded-md border bg-transparent p-2"
												name="full_name"
												placeholder="Organization"
												required
											/>
										</div>
										<div>
											<label for="email" class="mb-1 block text-sm font-medium">Email Address</label
											>
											<input
												type="email"
												class="w-full rounded-md border bg-transparent p-2"
												name="email"
												placeholder="Email Address"
												required
											/>
										</div>

										<Button
											type="submit"
											class="mt-4 w-full bg-amber-500 text-white hover:bg-amber-600"
											>Set a password on the next page</Button
										>
									</form>
								</div>
							</div>
						</div>
					</div>
				</section>

				<!-- Join us online section -->
				<section class="container mx-auto px-4 py-16">
					<div class="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
						<div class="lg:w-7/12">
							<h2 class="mb-6 text-4xl font-bold">JOIN US ONLINE!</h2>
							<p class="mb-4 text-lg">
								Can't make it in person? No problem! We've got you covered. You can join us online
								via Zoom.
							</p>

							<div class="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
								<div class="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
									<Video size={32} class="text-violet-600" />
								</div>
								<div>
									<p class="font-medium">Zoom Meeting Link:</p>
									<a
										href="https://us06web.zoom.us/j/86803449142?pwd=T7tDCvQpKZ7j76swtHkVHzDRTnxKYX.1"
										class="text-violet-600 hover:underline"
									>
										Click here to join the meeting
									</a>
								</div>
							</div>

							<p class="mb-4 text-lg">
								To make things even easier, you can scan the QR code with your smartphone to join
								the meeting instantly.
							</p>

							<p class="mb-4 text-lg">
								Please note: If you're using Zoom for the first time, you might need to install the
								Zoom app on your device.
							</p>

							<p class="text-lg">We look forward to seeing you online!</p>
						</div>

						<div class="flex justify-center lg:w-5/12">
							<div class="h-60 w-60 rounded-xl border-4 border-amber-300 bg-white p-4 shadow-lg">
								<!-- Placeholder for QR code -->
								<img
									class="flex h-full w-full items-center justify-center bg-violet-50"
									alt="QR Code for Zoom Meeting"
									src="/static/featured/zoom_meeting.svg"
								/>
							</div>
						</div>
					</div>
				</section>

				<!-- Options -->
				<section class="bg-gradient-to-r from-amber-50 to-violet-50 py-16">
					<div class="container mx-auto px-4">
						<h2 class="mb-12 text-center text-4xl font-semibold">Let's Get You Connected</h2>
						<p class="mb-8 text-center text-xl">
							Whether you're launching your career or building a team, start here.
						</p>
						<div class="flex flex-col gap-8 md:flex-row">
							<div
								class="flex-1 rounded-lg border border-violet-200 bg-white p-6 shadow-md transition-all hover:shadow-lg"
							>
								<Rocket size="64" class="mb-4 text-amber-500" strokeWidth="1" />
								<h3 class="mb-2 text-2xl font-medium">
									For <span class="font-bold underline">Students &amp; Alumni</span>
								</h3>
								<p class="mb-4 text-lg">Launch Your Tech Career with Confidence</p>
								<p class="mb-6">
									Join UB's exclusive network of IT professionals. Whether you're preparing for your
									first internship or seeking new opportunities, this platform puts your profile in
									front of real employers.
								</p>
								<div class="mb-6">
									<p class="font-medium">Why Join:</p>
									<ul class="ml-5 mt-2 list-disc space-y-1">
										<li>Build your professional profile and showcase your work</li>
										<li>Be visible to top employers hiring tech talent</li>
										<li>Access exclusive internship and job opportunities</li>
									</ul>
								</div>
								<a href="/auth/register">
									<Button class="w-fit bg-violet-600 text-white hover:bg-violet-700">
										Create Your Profile
									</Button>
								</a>
							</div>

							<div
								class="flex-1 rounded-lg border border-amber-200 bg-white p-6 shadow-md transition-all hover:shadow-lg"
							>
								<CheckSquare size="64" class="mb-4 text-violet-500" strokeWidth="1" />
								<h3 class="mb-2 text-2xl font-medium">
									For <span class="font-bold underline">Employers</span>
								</h3>
								<p class="mb-4 text-lg">Connect with UB's Tech Talent</p>
								<p class="mb-6">
									Looking for skilled interns or graduates in IT? This is your direct link to the
									University of Belize's top talent — trained in theory, practice, and innovation.
								</p>
								<div class="mb-6">
									<p class="font-medium">What You Get:</p>
									<ul class="ml-5 mt-2 list-disc space-y-1">
										<li>Access to curated profiles of UB IT students and alumni</li>
										<li>A streamlined path to recruit the right talent for your team</li>
									</ul>
								</div>
								<a href="/auth/register?force_choice=host">
									<Button class="w-fit bg-amber-500 text-white hover:bg-amber-600">
										Register as a host
									</Button>
								</a>
							</div>
						</div>
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
	</main>

	<!-- Footer -->
	<footer class="bg-gradient-to-r from-violet-800 to-fuchsia-700 py-12 text-white">
		<div class="container mx-auto px-4">
			<div class="flex flex-col gap-12 lg:flex-row">
				<!-- Logo and about section -->
				<div class="lg:w-5/12">
					<div
						class="mb-6 flex w-fit justify-center rounded-lg bg-violet-50 px-4 py-2 lg:justify-start"
					>
						<Logo />
					</div>
					<p class="mb-4 text-lg">
						IT Careers connects employers with emerging and experienced tech talent from the
						University of Belize — quickly, easily, and all in one place. Join our growing network
						today.
					</p>
					<a href="/auth/login">
						<Button
							class="flex w-fit items-center gap-2 bg-white text-violet-800 hover:bg-amber-100"
						>
							<Mail size={16} />
							<span>Login with email</span>
						</Button>
					</a>
				</div>

				<!-- Links section -->
				<div class="lg:w-3/12">
					<h3 class="mb-4 text-xl font-bold">Sitemap</h3>
					<ul class="space-y-2">
						<li><a href="/" class="hover:text-amber-300" data-sveltekit-reload>Home</a></li>
						<li>
							<a href="/?tab=1" class="hover:text-amber-300" data-sveltekit-reload>Interns</a>
						</li>
						<li>
							<a href="/?tab=2" class="hover:text-amber-300" data-sveltekit-reload
								>Presentation Agenda</a
							>
						</li>
						<li>
							<a href="/?tab=3" class="hover:text-amber-300" data-sveltekit-reload
								>Host Organizations</a
							>
						</li>
						<li>
							<a href="/auth/login" class="hover:text-amber-300" data-sveltekit-reload>Login</a>
						</li>
						<li>
							<a href="/auth/register" class="hover:text-amber-300" data-sveltekit-reload
								>Register</a
							>
						</li>
					</ul>
				</div>

				<!-- Contact section -->
				<div class="lg:w-4/12">
					<h3 class="mb-4 text-xl font-bold">Contact</h3>
					<ul class="space-y-3">
						<li class="flex items-start gap-2">
							<MapPin size={20} class="mt-1 flex-shrink-0 text-amber-300" />
							<p>Hummingbird Avenue, Belmopan, Belize</p>
						</li>
						<li class="flex items-start gap-2">
							<Phone size={20} class="mt-1 flex-shrink-0 text-amber-300" />
							<p>(501) 822-1000</p>
						</li>
						<li class="flex items-start gap-2">
							<Mail size={20} class="mt-1 flex-shrink-0 text-amber-300" />
							<a href="mailto:2022156465@ub.edu.bz" class="hover:text-amber-300"
								>{PUBLIC_SUPPORT_EMAIL}</a
							>
						</li>
					</ul>
				</div>
			</div>

			<!-- Copyright -->
			<div class="mt-12 border-t border-white/20 pt-6 text-center">
				<p>
					&copy; {new Date().getFullYear()}
					{PUBLIC_PLATFORM_NAME} Platform {PUBLIC_PLATFORM_SPONSOR_NAME} | All rights reserved
				</p>
			</div>
		</div>
	</footer>
</div>
