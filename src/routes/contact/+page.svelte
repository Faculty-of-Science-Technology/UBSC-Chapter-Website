<script lang="ts">
	import { enhance } from '$app/forms';
	import Footer from '$lib/components/global/footer.svelte';
	import PublicNav from '$lib/components/public/nav.svelte';
	import { Badge } from '$lib/components/vendor/ui/badge';
	import { Button } from '$lib/components/vendor/ui/button';
	import * as Card from '$lib/components/vendor/ui/card';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
	import * as Select from '$lib/components/vendor/ui/select';
	import { Textarea } from '$lib/components/vendor/ui/textarea';
	import HeroBlock from '$lib/templates/landing/blocks/hero-block.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let loading = $state(false);
	let contactForm = $state({
		name: '',
		email: '',
		subject: '',
		category: '',
		message: ''
	});
</script>

<svelte:head>
	<title>Contact Us - UBSC Chapter</title>
	<meta
		name="description"
		content="Get in touch with the University of Belize ACM Chapter. Whether you have questions, want to join, or need assistance, we're here to help."
	/>
</svelte:head>

<page class="inline-flex h-full w-full flex-col items-center gap-32">
	<PublicNav />
	<main class="mx-2 flex flex-col items-center gap-48 self-stretch lg:mx-20 xl:mx-80">
		<!-- Hero Section -->
		<section class="w-full">
			<HeroBlock
				no_signup
				text_light_blue="Get in"
				text="Touch"
				subtitle="Have questions about our chapter, want to join our community, or need assistance? We'd love to hear from you. Reach out to us through any of the channels below."
			/>
		</section>

		<!-- Contact Methods Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Ways to Reach Us</h2>
				<p class="mx-auto max-w-2xl text-gray-600">Choose the method that works best for you</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
						>
							<svg
								class="h-8 w-8 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Email</Card.Title>
						<Card.Description class="mb-4 text-sm">
							Send us an email for general inquiries
						</Card.Description>
						<a href="mailto:ubsc@ub.edu.bz" class="font-medium text-blue-600 hover:text-blue-800">
							ubsc@ub.edu.bz
						</a>
					</Card.Header>
				</Card.Root>

				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
						>
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Phone</Card.Title>
						<Card.Description class="mb-4 text-sm">Call us during office hours</Card.Description>
						<a href="tel:+5012237040" class="font-medium text-green-600 hover:text-green-800">
							+501 223-7040
						</a>
					</Card.Header>
				</Card.Root>

				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100"
						>
							<svg
								class="h-8 w-8 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Visit Us</Card.Title>
						<Card.Description class="mb-4 text-sm">Come to our office on campus</Card.Description>
						<p class="text-sm font-medium text-purple-600">
							University of Belize<br />
							Belmopan Campus<br />
							Faculty of Science & Technology
						</p>
					</Card.Header>
				</Card.Root>

				<Card.Root class="p-6 text-center transition-shadow hover:shadow-lg">
					<Card.Header>
						<div
							class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100"
						>
							<svg
								class="h-8 w-8 text-orange-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<Card.Title class="mb-2 text-lg">Social Media</Card.Title>
						<Card.Description class="mb-4 text-sm">
							Follow us for updates and announcements
						</Card.Description>
						<div class="flex justify-center gap-2">
							<Badge variant="outline" class="text-xs">Facebook</Badge>
							<Badge variant="outline" class="text-xs">Instagram</Badge>
						</div>
					</Card.Header>
				</Card.Root>
			</div>
		</section>

		<!-- Contact Form Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Send us a Message</h2>
				<p class="mx-auto max-w-2xl text-gray-600">
					Fill out the form below and we'll get back to you as soon as possible
				</p>
			</div>

			<Card.Root class="mx-auto max-w-2xl p-8">
				<form
					method="POST"
					action="?/sendMessage"
					use:enhance={() => {
						loading = true;
						return async ({ update }) => {
							loading = false;
							await update();
						};
					}}
				>
					<div class="space-y-6">
						<div class="grid gap-4 md:grid-cols-2">
							<div>
								<Label for="name">Full Name *</Label>
								<Input
									type="text"
									id="name"
									name="name"
									bind:value={contactForm.name}
									required
									placeholder="Enter your full name"
								/>
							</div>
							<div>
								<Label for="email">Email Address *</Label>
								<Input
									type="email"
									id="email"
									name="email"
									bind:value={contactForm.email}
									required
									placeholder="Enter your email address"
								/>
							</div>
						</div>

						<div>
							<Label for="category">Category</Label>
							<Select.Root type="single">
								<Select.Trigger class="w-full">
									<span class="text-muted-foreground">
										{contactForm.category
											? contactForm.category.charAt(0).toUpperCase() +
												contactForm.category.slice(1).replace(/([A-Z])/g, ' $1')
											: 'Select a category'}
									</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="general" onclick={() => (contactForm.category = 'general')}
										>General Inquiry</Select.Item
									>
									<Select.Item
										value="membership"
										onclick={() => (contactForm.category = 'membership')}>Membership</Select.Item
									>
									<Select.Item value="events" onclick={() => (contactForm.category = 'events')}
										>Events & Workshops</Select.Item
									>
									<Select.Item
										value="partnerships"
										onclick={() => (contactForm.category = 'partnerships')}
										>Partnerships</Select.Item
									>
									<Select.Item
										value="technical"
										onclick={() => (contactForm.category = 'technical')}
										>Technical Support</Select.Item
									>
									<Select.Item value="feedback" onclick={() => (contactForm.category = 'feedback')}
										>Feedback & Suggestions</Select.Item
									>
								</Select.Content>
							</Select.Root>
							<input type="hidden" name="category" bind:value={contactForm.category} />
						</div>

						<div>
							<Label for="subject">Subject *</Label>
							<Input
								type="text"
								id="subject"
								name="subject"
								bind:value={contactForm.subject}
								required
								placeholder="Brief description of your inquiry"
							/>
						</div>

						<div>
							<Label for="message">Message *</Label>
							<Textarea
								id="message"
								name="message"
								bind:value={contactForm.message}
								required
								rows={6}
								placeholder="Please provide details about your inquiry..."
							/>
						</div>

						<Button type="submit" size="lg" class="w-full" disabled={loading}>
							{loading ? 'Sending...' : 'Send Message'}
						</Button>
					</div>
				</form>
			</Card.Root>
		</section>

		<!-- FAQ Section -->
		<section class="w-full">
			<div class="mb-12 text-center">
				<h2 class="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
				<p class="mx-auto max-w-2xl text-gray-600">Quick answers to common questions</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2">
				<Card.Root class="p-6">
					<Card.Header>
						<Card.Title class="text-lg text-blue-600">How can I join the chapter?</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-gray-600">
							To join our chapter, you need to be a current student or faculty member at the
							University of Belize. Contact us through email or attend one of our events to learn
							more about the membership process.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="p-6">
					<Card.Header>
						<Card.Title class="text-lg text-green-600">Are events free for members?</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-gray-600">
							Most of our workshops and seminars are free for chapter members. Some special events
							or external workshops may have a nominal fee to cover materials and refreshments.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="p-6">
					<Card.Header>
						<Card.Title class="text-lg text-purple-600">Can I propose a workshop topic?</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-gray-600">
							Absolutely! We encourage members to suggest workshop topics or even volunteer to lead
							sessions. Contact our events committee with your ideas and we'll help you organize it.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root class="p-6">
					<Card.Header>
						<Card.Title class="text-lg text-orange-600">How often do you meet?</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-gray-600">
							We typically hold general meetings monthly, with additional workshops and events
							throughout the semester. Special Interest Groups and committees may meet more
							frequently based on their activities.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Office Hours Section -->
		<section class="w-full">
			<Card.Root class="bg-gradient-to-r from-blue-50 to-purple-50 p-12">
				<Card.Header class="text-center">
					<Card.Title class="mb-4 text-3xl font-bold">Office Hours</Card.Title>
				</Card.Header>
				<Card.Content class="text-center">
					<p class="mx-auto mb-8 max-w-2xl text-gray-700">
						Our chapter office is open during the following hours. Feel free to drop by for
						questions, assistance, or just to say hello!
					</p>

					<div class="mx-auto grid max-w-md gap-8 md:grid-cols-2">
						<div>
							<h4 class="mb-3 text-lg font-semibold">Academic Year</h4>
							<div class="space-y-2 text-gray-600">
								<p><strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM</p>
								<p><strong>Saturday:</strong> 10:00 AM - 2:00 PM</p>
								<p><strong>Sunday:</strong> Closed</p>
							</div>
						</div>

						<div>
							<h4 class="mb-3 text-lg font-semibold">Summer Break</h4>
							<div class="space-y-2 text-gray-600">
								<p><strong>Monday - Friday:</strong> 10:00 AM - 3:00 PM</p>
								<p><strong>Weekend:</strong> Closed</p>
								<p class="text-sm italic">Limited staff availability</p>
							</div>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</section>
	</main>
	<Footer />
</page>
