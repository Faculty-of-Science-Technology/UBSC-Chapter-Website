<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>About Us - UBSC Chapter</title>
	<meta name="description" content="Learn more about the University of Belize's Associate for Computer Machinery (ACM) Chapter and our mission to advance technology education in Belize." />
</svelte:head>

<page class="inline-flex flex-col items-center gap-32 w-full h-full">
	<PublicNav />
	<main class="flex flex-col items-center gap-48 self-stretch mx-2 lg:mx-20 xl:mx-80">
		<!-- Hero Section -->
		<section class="w-full">
			<HeroBlock
				text_light_blue="About"
				text="UBSC Chapter"
				subtitle="The University of Belize's Associate for Computer Machinery (ACM) Chapter is dedicated to advancing technology education, fostering innovation, and building a strong community of technology enthusiasts in Belize."
			/>
		</section>

		<!-- Mission & Vision Section -->
		<section class="w-full">
			<div class="grid md:grid-cols-2 gap-8">
				<Card.Root class="p-8">
					<Card.Header>
						<Card.Title class="text-2xl font-bold text-blue-600">Our Mission</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-700 leading-relaxed">
							To empower students and professionals in Belize through technology education, hands-on learning experiences, and collaborative innovation. We strive to bridge the gap between academic learning and industry demands while fostering a vibrant tech community.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="p-8">
					<Card.Header>
						<Card.Title class="text-2xl font-bold text-purple-600">Our Vision</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-700 leading-relaxed">
							To become the leading technology organization in Belize, driving innovation, promoting digital literacy, and creating opportunities for the next generation of technology leaders and entrepreneurs.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- What We Do Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">What We Do</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Our chapter provides diverse opportunities for learning, networking, and professional development
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-6">
				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
						</div>
						<Card.Title>Education & Workshops</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Regular workshops, seminars, and training sessions covering the latest technologies and industry best practices.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<Card.Title>Networking Events</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Connect with industry professionals, fellow students, and potential mentors through our networking events and meetups.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
					<Card.Header>
						<div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
						</div>
						<Card.Title>Innovation Projects</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Collaborate on innovative projects, participate in hackathons, and work on real-world solutions to local challenges.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Core Values Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Our Core Values</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					These principles guide everything we do and shape our community culture
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-lg">Innovation</Badge>
					<p class="text-sm text-gray-600">Embracing new technologies and creative solutions</p>
				</div>
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-lg">Collaboration</Badge>
					<p class="text-sm text-gray-600">Working together to achieve common goals</p>
				</div>
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-lg">Excellence</Badge>
					<p class="text-sm text-gray-600">Striving for the highest standards in everything we do</p>
				</div>
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-lg">Community</Badge>
					<p class="text-sm text-gray-600">Building strong relationships and supporting each other</p>
				</div>
			</div>
		</section>

		<!-- Leadership Section -->
		<section class="w-full">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Leadership Team</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					Meet the dedicated individuals who help guide our chapter's direction and activities
				</p>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.leadership || [] as leader}
					<Card.Root class="text-center p-6 hover:shadow-lg transition-shadow">
						<Card.Header>
							{#if leader.profilePicture}
								<img 
									src={leader.profilePicture} 
									alt="{leader.firstName} {leader.lastName}"
									class="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
								/>
							{:else}
								<div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
									<span class="text-xl font-bold text-gray-600">
										{leader.firstName[0]}{leader.lastName[0]}
									</span>
								</div>
							{/if}
							<Card.Title class="text-lg">{leader.firstName} {leader.lastName}</Card.Title>
							<Badge variant="secondary" class="mb-2">{leader.role}</Badge>
						</Card.Header>
						{#if leader.bio}
							<Card.Content>
								<p class="text-sm text-gray-600">{leader.bio}</p>
							</Card.Content>
						{/if}
					</Card.Root>
				{/each}
			</div>
		</section>

		<!-- Join Us Section -->
		<section class="w-full text-center">
			<Card.Root class="p-12 bg-gradient-to-r from-blue-50 to-purple-50">
				<Card.Header>
					<Card.Title class="text-3xl font-bold mb-4">Join Our Community</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-gray-700 mb-8 max-w-2xl mx-auto">
						Whether you're a student, professional, or just passionate about technology, 
						there's a place for you in our chapter. Join us in shaping the future of technology in Belize.
					</p>
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<Button size="lg" class="px-8">
							Become a Member
						</Button>
						<Button variant="outline" size="lg" class="px-8">
							Contact Us
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</section>
	</main>
	<Footer />
</page>
