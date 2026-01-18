<script lang="ts">
	import Footer from '$lib/components/global/footer.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>About Us - UBSC Chapter</title>
	<meta
		name="description"
		content="Learn more about the University of Belize's Associate for Computer Machinery (ACM) Chapter and our mission to advance technology education in Belize."
	/>
</svelte:head>

<page class="inline-flex h-full w-full flex-col items-center gap-32">
	<!-- Hero Section -->
	<section class="flex h-[300px] w-full items-center justify-center bg-muted md:px-32">
		<HeroBlock
			class="self-auto"
			no_signup
			text_light_blue="About"
			text="UBSC Chapter"
			subtitle="The University of Belize's Associate for Computer Machinery (ACM) Chapter is dedicated to advancing technology education, fostering innovation, and building a strong community of technology enthusiasts in Belize."
		/>
	</section>
	<main class="mx-2 flex flex-col items-center gap-32 self-stretch lg:mx-20 xl:mx-32">
		<!-- Mission & Vision Section -->
		<section class="w-full">
			<div class="grid gap-8 md:grid-cols-2">
				<Card.Root class="border-primary/20 p-8">
					<Card.Header>
						<Card.Title class="text-8xl font-semibold text-primary">Our Mission</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="leading-relaxed text-secondary/70">
							To empower students and professionals in Belize through technology education, hands-on
							learning experiences, and collaborative innovation. We strive to bridge the gap
							between academic learning and industry demands while fostering a vibrant tech
							community.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="border-primary/20 p-8">
					<Card.Header>
						<Card.Title class="text-8xl font-semibold text-primary">Our Vision</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="leading-relaxed text-secondary/70">
							To become the leading technology organization in Belize, driving innovation, promoting
							digital literacy, and creating opportunities for the next generation of technology
							leaders and entrepreneurs.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- What We Do Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<HeroBlock
					center
					no_signup
					text_light_blue="What"
					text="We Do"
					subtitle="Our chapter provides diverse opportunities for learning, networking, and professional development"
					size_text="text-6xl"
				/>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				<Card.Root class="border-primary/20 p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
						>
							<svg
								class="h-8 w-8 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
						</div>
						<Card.Title class="text-2xl font-semibold text-primary"
							>Education & Workshops</Card.Title
						>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Regular workshops, seminars, and training sessions covering the latest technologies
							and industry best practices.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="border-primary/20 p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20"
						>
							<svg
								class="h-8 w-8 text-secondary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<Card.Title class="text-2xl font-semibold text-primary">Networking Events</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Connect with industry professionals, fellow students, and potential mentors through
							our networking events and meetups.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="border-primary/20 p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
						>
							<svg
								class="h-8 w-8 text-primary"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
						</div>
						<Card.Title class="text-2xl font-semibold text-primary">Innovation Projects</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-gray-600">
							Collaborate on innovative projects, participate in hackathons, and work on real-world
							solutions to local challenges.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Core Values Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<HeroBlock
					center
					no_signup
					text_light_blue="Our"
					text="Core Values"
					subtitle="These principles guide everything we do and shape our community culture"
					size_text="text-6xl"
				/>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-8xl text-primary">Innovation</Badge>
					<p class="text-sm text-primary">Embracing new technologies and creative solutions</p>
				</div>
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-8xl text-primary">Collaboration</Badge
					>
					<p class="text-sm text-primary">Working together to achieve common goals</p>
				</div>
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-8xl text-primary">Excellence</Badge>
					<p class="text-sm text-primary">Striving for the highest standards in everything we do</p>
				</div>
				<div class="text-center">
					<Badge variant="outline" class="mb-3 px-4 py-2 text-8xl text-primary">Community</Badge>
					<p class="text-sm text-primary">
						Building strong relationships and supporting each other
					</p>
				</div>
			</div>
		</section>

		<!-- Leadership Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<HeroBlock
					class="self-auto"
					no_signup
					text_light_blue="Leadership"
					text="Team"
					subtitle="Meet the dedicated individuals who help guide our chapter's direction and activities"
					size_text="text-8xl"
				/>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
				{#each data.leadership || [] as leader}
					<Card.Root class="border-primary/20 p-6 text-center transition-shadow hover:shadow-lg">
						<Card.Header>
							{#if leader.profilePicture}
								<img
									src={leader.profilePicture}
									alt="{leader.firstName} {leader.lastName}"
									class="mx-auto mb-4 h-24 w-24 rounded-full object-cover"
								/>
							{:else}
								<div
									class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
								>
									<span class="text-xl font-bold text-primary">
										{leader.firstName[0]}{leader.lastName[0]}
									</span>
								</div>
							{/if}
							<Card.Title class="pb-8 text-2xl font-semibold text-primary"
								>{leader.firstName} {leader.lastName}</Card.Title
							>
							<Badge
								variant="secondary"
								class="mx-auto mb-2 block bg-primary/40 text-sky-700 hover:bg-primary/70 hover:text-primary"
							>
								{leader.role}</Badge
							>
						</Card.Header>
						{#if leader.bio}
							<Card.Content class="mt-4 rounded-md bg-muted p-4 text-center text-secondary/80">
								<p class="text-sm text-gray-600">{leader.bio}</p>
							</Card.Content>
						{/if}
					</Card.Root>
				{/each}
			</div>
		</section>

		<!-- Join Us Section -->
		<section class="w-full text-center">
			<Card.Root class="bg-gradient-to-r from-primary to-secondary p-12">
				<Card.Header>
					<Card.Title class="mb-4 text-3xl font-bold text-background">Join Our Community</Card.Title
					>
				</Card.Header>
				<Card.Content>
					<p class="mx-auto mb-8 max-w-2xl text-background">
						Whether you're a student, professional, or just passionate about technology, there's a
						place for you in our chapter. Join us in shaping the future of technology in Belize.
					</p>
					<div class="flex flex-col justify-center gap-4 sm:flex-row">
						<Button size="lg" class="px-8">Become a Member</Button>
						<Button variant="outline" size="lg" class="px-8">Contact Us</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</section>
	</main>
	<Footer />
</page>
