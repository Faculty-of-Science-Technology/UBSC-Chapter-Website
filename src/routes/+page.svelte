<script lang="ts">
	import { Homepage } from '$lib/assemblies/index';
	import Logo from '$lib/components/Logo.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as TabList from '$lib/components/vendor/ui/tablist/index';
	import { Calendar, CheckSquare, Mail, MapPin, Phone, Rocket } from 'lucide-svelte';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	let active_tab = $state(0);
</script>

<!-- Main layout with navbar styling similar to the reference -->
<div class="flex min-h-screen flex-col">
	<!-- Navbar -->
	<nav class="border-b border-amber-200 bg-white px-4 py-2 shadow-sm">
		<div class="container mx-auto flex items-center justify-between">
			<a href="/" class="flex items-center gap-2">
				<Logo/>
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
						title="Interns" 
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
				<a href="/auth/register" class="ml-4">
					<Button class="bg-amber-500 hover:bg-amber-600 text-white">Register Now</Button>
				</a>
			</div>
			
			<!-- Mobile menu button -->
			<button class="lg:hidden">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</button>
		</div>
		
		<!-- Mobile tabs - shown only on small screens -->
		<div class="mt-2 overflow-x-auto pb-2 lg:hidden">
			<TabList.Root class="flex gap-2 px-4">
				<TabList.Tab title="Home" onclick={() => (active_tab = 0)} active={active_tab === 0} />
				<TabList.Tab title="Interns" onclick={() => (active_tab = 1)} active={active_tab === 1} />
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
							<h1 class="mb-6 text-center text-4xl font-bold text-gray-900 lg:text-left lg:text-5xl">
								INTERNSHIP OVERVIEW
							</h1>
							<p class="text-lg text-gray-700">
								Our platform is designed to help employers connect with the perfect candidates quickly and
								effortlessly. With just one glance, you'll discover the skilled professionals you need to
								bring your vision to life. IT Careers connects you with people in tech from all around Belize.
								Join our community and select from our growing selection of candidates today!
							</p>
							<div class="mt-8 flex justify-center lg:justify-start">
								<a href="/auth/register">
									<Button class="bg-violet-600 hover:bg-violet-700 text-white">Register as an Intern</Button>
								</a>
								<a href="/auth/register?force_choice=host" class="ml-4">
									<Button class="bg-amber-500 hover:bg-amber-600 text-white">Register as a Host</Button>
								</a>
							</div>
						</div>
						<div class="lg:w-5/12">
							<div class="overflow-hidden rounded-lg">
								<img 
									src="/static/featured/Zyon_Morter.jpg" 
									alt="Featured Intern" 
									class="h-auto w-full rounded-lg object-cover shadow-md" 
								/>
							</div>
						</div>
					</div>
				</section>
				
				<!-- Registration Section -->
				<section class="bg-gradient-to-r from-violet-700 to-fuchsia-600 py-16 text-white">
					<div class="container mx-auto px-4">
						<div class="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
							<div class="lg:w-7/12">
								<h2 class="mb-6 text-4xl font-bold">DON'T MISS OUT</h2>
								<p class="mb-8 text-xl">
									Not <span class="italic">JUST</span> your typical hiring platform. We connect you with people in tech 
									from all around Belize quickly and effortlessly. Join our community and select from our 
									growing selection of candidates today!
								</p>
								
								<div class="flex flex-col gap-6 sm:flex-row">
									<div class="rounded-lg border border-white/30 bg-white/10 p-4">
										<p class="font-bold">Associates Presentation</p>
										<a href="#" class="flex items-center gap-2 text-white hover:underline">
											<Calendar size={20} />
											<span>May 2nd, 2025</span>
										</a>
									</div>
									
									<div class="rounded-lg border border-white/30 bg-white/10 p-4">
										<p class="font-bold">Bachelors Presentation</p>
										<a href="#" class="flex items-center gap-2 text-white hover:underline">
											<Calendar size={20} />
											<span>May 3rd, 2025</span>
										</a>
									</div>
								</div>
							</div>
							
							<div class="w-full lg:w-5/12">
								<div class="rounded-lg bg-white p-6 text-gray-800 shadow-lg">
									<h3 class="mb-2 text-2xl font-bold text-violet-800">Register</h3>
									<p class="mb-6 text-gray-600">Sign up to attend the intern's presentation.</p>
									
									<form class="flex flex-col gap-4">
										<div class="flex flex-col gap-4 sm:flex-row">
											<div class="flex-1">
												<label class="mb-1 block text-sm font-medium">First Name</label>
												<input type="text" class="w-full rounded-md border p-2" placeholder="First name" required />
											</div>
											<div class="flex-1">
												<label class="mb-1 block text-sm font-medium">Last Name</label>
												<input type="text" class="w-full rounded-md border p-2" placeholder="Last name" required />
											</div>
										</div>
										
										<div>
											<label class="mb-1 block text-sm font-medium">Organization</label>
											<input type="text" class="w-full rounded-md border p-2" placeholder="Organization" required />
										</div>
										
										<div>
											<p class="mb-2 font-medium">Attending Date:</p>
											<div class="flex gap-4 flex-wrap">
												<label class="flex items-center gap-2">
													<input type="radio" name="attending-date" value="2 May 2024" required />
													<span>May 2nd, 2025</span>
												</label>
												<label class="flex items-center gap-2">
													<input type="radio" name="attending-date" value="3 May 2024" required />
													<span>May 3rd, 2025</span>
												</label>
												<label class="flex items-center gap-2">
													<input type="radio" name="attending-date" value="Both" required />
													<span>Both</span>
												</label>
											</div>
										</div>
										
										<div>
											<p class="mb-2 font-medium">Attending:</p>
											<div class="flex gap-4">
												<label class="flex items-center gap-2">
													<input type="radio" name="attending_type" value="Online" required />
													<span>Online</span>
												</label>
												<label class="flex items-center gap-2">
													<input type="radio" name="attending_type" value="In Person" required />
													<span>In Person</span>
												</label>
											</div>
										</div>
										
										<Button type="submit" class="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white">Submit</Button>
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
								Can't make it in person? No problem! We've got you covered. You can join us online via Zoom.
							</p>
							
							<div class="mb-6 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
								<div class="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
									<svg class="h-8 w-8 text-violet-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.2 11.08C15.2 13.3534 13.3634 15.19 11.09 15.19C8.8166 15.19 6.98 13.3534 6.98 11.08C6.98 8.8066 8.8166 6.97 11.09 6.97C13.3634 6.97 15.2 8.8066 15.2 11.08Z" fill="currentColor"/>
										<path d="M21.8 10.2C21.8 16.32 13.32 20.7 9.41 16.79C5.5 12.88 9.89 4.4 16 4.4C19.35 4.4 21.8 6.85 21.8 10.2Z" stroke="currentColor" stroke-width="2"/>
									</svg>
								</div>
								<div>
									<p class="font-medium">Zoom Meeting Link:</p>
									<a href="https://us06web.zoom.us/j/86803449142" class="text-violet-600 hover:underline">
										Click here to join the meeting
									</a>
								</div>
							</div>
							
							<p class="mb-4 text-lg">
								To make things even easier, you can scan the QR code with your smartphone to join the meeting instantly.
							</p>
							
							<p class="mb-4 text-lg">
								Please note: If you're using Zoom for the first time, you might need to install the Zoom app on your device.
							</p>
							
							<p class="text-lg">We look forward to seeing you online!</p>
						</div>
						
						<div class="lg:w-5/12 flex justify-center">
							<div class="h-60 w-60 rounded-xl border-4 border-amber-300 bg-white p-4 shadow-lg">
								<!-- Placeholder for QR code -->
								<div class="flex h-full w-full items-center justify-center bg-violet-50">
									<p class="text-center text-sm text-gray-500">QR Code for Zoom meeting</p>
								</div>
							</div>
						</div>
					</div>
				</section>
				
				<!-- Options -->
				<section class="bg-gradient-to-r from-amber-50 to-violet-50 py-16">
					<div class="container mx-auto px-4">
						<h2 class="mb-12 text-center text-3xl font-bold">What we do to fix this?</h2>
						<div class="flex flex-col gap-8 md:flex-row">
							<div class="flex-1 rounded-lg border border-violet-200 bg-white p-6 shadow-md transition-all hover:shadow-lg">
								<Rocket size="64" class="mb-4 text-amber-500" strokeWidth="1" />
								<h3 class="mb-2 text-2xl font-medium">Kickstart Your <span class="font-bold underline">Career</span></h3>
								<p class="mb-6 text-lg">Find your next job</p>
								<a href="/auth/register">
									<Button class="w-fit bg-violet-600 hover:bg-violet-700 text-white">Register as an Intern</Button>
								</a>
							</div>
							
							<div class="flex-1 rounded-lg border border-amber-200 bg-white p-6 shadow-md transition-all hover:shadow-lg">
								<CheckSquare size="64" class="mb-4 text-violet-500" strokeWidth="1" />
								<h3 class="mb-2 text-2xl font-medium">Acquire <span class="font-bold underline">Talent</span></h3>
								<p class="mb-6 text-lg">Because, why look anywhere else?</p>
								<a href="/auth/register?force_choice=host">
									<Button class="w-fit bg-amber-500 hover:bg-amber-600 text-white">Register as a Host</Button>
								</a>
							</div>
						</div>
					</div>
				</section>
				
			{:else if active_tab === 1}
				<Homepage.Interns avatar_data={data.avatar_data} />
			{:else if active_tab === 2}
				<Homepage.PresentationAgenda />
			{:else if active_tab === 3}
				<Homepage.HostOrganizations />
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
					<div class="mb-6 flex justify-center lg:justify-start bg-violet-50 w-fit px-4 py-2 rounded-lg">
						<Logo />
					</div>
					<p class="mb-4 text-lg">
						IT Careers connects you with people in tech from all around Belize quickly and effortlessly.
						Join our community and select from our growing selection of candidates today :)
					</p>
					<a href="/auth/login">
						<Button class="flex w-fit items-center gap-2 bg-white text-violet-800 hover:bg-amber-100">
							<Mail size={16} />
							<span>Login with email</span>
						</Button>
					</a>
				</div>
				
				<!-- Links section -->
				<div class="lg:w-3/12">
					<h3 class="mb-4 text-xl font-bold">Sitemap</h3>
					<ul class="space-y-2">
						<li><a href="/" class="hover:text-amber-300">Home</a></li>
						<li><a href="/archive/interns" class="hover:text-amber-300">Interns</a></li>
						<li><a href="/" class="hover:text-amber-300">Presentation Agenda</a></li>
						<li><a href="/" class="hover:text-amber-300">Host Organizations</a></li>
						<li><a href="/auth/login" class="hover:text-amber-300">Login</a></li>
						<li><a href="/auth/register" class="hover:text-amber-300">Register</a></li>
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
							<a href="mailto:2022156465@ub.edu.bz" class="hover:text-amber-300">2022156465@ub.edu.bz</a>
						</li>
					</ul>
				</div>
			</div>
			
			<!-- Copyright -->
			<div class="mt-12 border-t border-white/20 pt-6 text-center">
				<p>© 2024 Talent Pool Platform | All rights reserved</p>
			</div>
		</div>
	</footer>
</div>
