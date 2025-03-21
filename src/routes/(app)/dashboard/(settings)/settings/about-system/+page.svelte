<script lang="ts">
	import { PUBLIC_SUPPORT_EMAIL } from '$env/static/public';
	import { Badge } from '$lib/components/vendor/ui/badge/index.js';
	import { Button } from '$lib/components/vendor/ui/button/index.js';
	import * as Card from '$lib/components/vendor/ui/card/index.js';
	import { ArrowUpRight } from 'lucide-svelte';
</script>

<section class="space-y-10">
	<section class="header text-archivo flex flex-col space-y-1 pb-4">
		<h1 class="text-5xl font-extralight lg:text-6xl">About Talentpool</h1>
		<p class="text-lg lg:text-2xl">Intern management platform</p>
	</section>

	<Card.Root>
		<Card.Header>
			<Card.Title>About the Platform</Card.Title>
			<Card.Description>
				Talentpool is designed to streamline intern management and placement
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-muted-foreground">
				Launched in 2025, Talentpool helps organizations connect with talented interns and manage
				their programs effectively. Our platform provides tools for tracking applications, managing
				placements, and facilitating communication between interns and mentors.
			</p>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>Key Features</Card.Title>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">1</Badge>
				<div>
					<h3 class="font-medium">Intern Gallery</h3>
					<p class="text-muted-foreground">
						Comprehensive listing of all registered interns with filtering capabilities
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">2</Badge>
				<div>
					<h3 class="font-medium">Org Gallery</h3>
					<p class="text-muted-foreground">
						Comprehensive listing of all registered organizations with filtering capabilities
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">3</Badge>
				<div>
					<h3 class="font-medium">Job Posting & Management</h3>
					<p class="text-muted-foreground">
						Post and manage job listings for interns, including application tracking and status
						updates
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">4</Badge>
				<div>
					<h3 class="font-medium">Group Management</h3>
					<p class="text-muted-foreground">
						Create and organize interns into logical groups for better management
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">5</Badge>
				<div>
					<h3 class="font-medium">Agenda Management</h3>
					<p class="text-muted-foreground">
						Post and publish events, workshops, and other activities onto the homepage
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">6</Badge>
				<div>
					<h3 class="font-medium">Follow-Up</h3>
					<p class="text-muted-foreground">
						Follow up with interns and their applications to ensure a smooth experience
					</p>
				</div>
			</div>
			<div class="flex items-start gap-3">
				<Badge variant="outline" class="mt-0.5">7</Badge>
				<div>
					<h3 class="font-medium">Profile Customization</h3>
					<p class="text-muted-foreground">
						Customize things such as your skills, contact information, and more
					</p>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="flex flex-row items-center">
			<div class="grid gap-2">
				<Card.Title>System Information</Card.Title>
				<Card.Description>Technical details about the platform</Card.Description>
			</div>
			<Button href="/dashboard/settings" size="sm" class="ml-auto gap-1">
				Settings
				<ArrowUpRight class="h-4 w-4" />
			</Button>
		</Card.Header>
		<Card.Content>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<h3 class="text-sm font-medium">Version</h3>
					<p class="text-muted-foreground">1.0.0</p>
				</div>
				<div>
					<h3 class="text-sm font-medium">Last Updated</h3>
					<p class="text-muted-foreground">March, 2025</p>
				</div>
				<div>
					<h3 class="text-sm font-medium">Support</h3>
					<p class="text-muted-foreground">{PUBLIC_SUPPORT_EMAIL}</p>
				</div>
				<div>
					<h3 class="text-sm font-medium">Author(s)</h3>
					<ul>
						<li>
							<a href="https://github.com/AlexDev404" target="_blank" class="text-primary underline"
								>AlexDev404</a
							>
						</li>
						<li>
							<a href="https://github.com/Lee26Ed" target="_blank" class="text-primary underline"
								>Lee26Ed</a
							>
						</li>
					</ul>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</section>
