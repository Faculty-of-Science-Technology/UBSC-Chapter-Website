<script lang="ts">
	import { PUBLIC_PLATFORM_UPDATED_AT, PUBLIC_PLATFORM_VERSION, PUBLIC_SUPPORT_EMAIL } from '$env/static/public';
	import { Badge } from '$lib/components/vendor/ui/badge/index.js';
	import { Button } from '$lib/components/vendor/ui/button/index.js';
	import * as Card from '$lib/components/vendor/ui/card/index.js';
	import {
		ArrowUpRight,
		BookOpenCheck,
		Building,
		Calendar,
		Github,
		Info,
		LayoutDashboard,
		LifeBuoy,
		MailCheck,
		SquareCode,
		Trophy,
		Users
	} from 'lucide-svelte';
</script>

<div class="flex flex-col gap-8">
	<!-- Page Header -->
	<div>
		<h1 class="text-3xl font-semibold tracking-tight">About Talentpool</h1>
		<p class="text-muted-foreground">
			Learn more about our intern management platform
		</p>
	</div>
	
	<!-- Platform Overview -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<Card.Root class="flex flex-col">
			<Card.Header class="pb-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<LayoutDashboard size={20} />
				</div>
			</Card.Header>
			<Card.Content class="flex-1">
				<h3 class="text-lg font-semibold">Modern Platform</h3>
				<p class="text-sm text-muted-foreground mt-2">
					Built with the latest technologies to provide a seamless experience for interns and organizations.
				</p>
			</Card.Content>
		</Card.Root>
		
		<Card.Root class="flex flex-col">
			<Card.Header class="pb-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Building size={20} />
				</div>
			</Card.Header>
			<Card.Content class="flex-1">
				<h3 class="text-lg font-semibold">Organization Tools</h3>
				<p class="text-sm text-muted-foreground mt-2">
					Comprehensive suite of tools for organizations to manage interns, post jobs, and track applications.
				</p>
			</Card.Content>
		</Card.Root>
		
		<Card.Root class="flex flex-col">
			<Card.Header class="pb-2">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Trophy size={20} />
				</div>
			</Card.Header>
			<Card.Content class="flex-1">
				<h3 class="text-lg font-semibold">Talent Discovery</h3>
				<p class="text-sm text-muted-foreground mt-2">
					Find and connect with talented individuals ready to contribute to your projects and grow professionally.
				</p>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- About the Platform -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<Info class="h-5 w-5 text-muted-foreground" />
				<Card.Title>About the Platform</Card.Title>
			</div>
			<Card.Description>
				Talentpool is designed to streamline intern management and placement
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p>
				Launched in 2025, Talentpool helps organizations connect with talented interns and manage
				their programs effectively. Our platform provides tools for tracking applications, managing
				placements, and facilitating communication between interns and mentors.
			</p>
			<p class="mt-4">
				Talentpool aims to bridge the gap between talent and opportunity, creating a streamlined
				pathway for interns to find meaningful roles and for organizations to discover the perfect
				candidates for their needs.
			</p>
		</Card.Content>
	</Card.Root>

	<!-- Key Features -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<BookOpenCheck class="h-5 w-5 text-muted-foreground" />
				<Card.Title>Key Features</Card.Title>
			</div>
			<Card.Description>
				Core functionalities that make Talentpool powerful
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						<Users size={16} />
					</div>
					<div>
						<h3 class="font-medium">Intern Gallery</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Browse profiles of qualified interns with advanced filtering capabilities
						</p>
					</div>
				</div>
				
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						<Building size={16} />
					</div>
					<div>
						<h3 class="font-medium">Organization Directory</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Explore participating organizations with detailed profiles and current opportunities
						</p>
					</div>
				</div>
				
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						<SquareCode size={16} />
					</div>
					<div>
						<h3 class="font-medium">Job Management</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Post positions, track applications, and manage the entire hiring process
						</p>
					</div>
				</div>
				
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						<Users size={16} />
					</div>
					<div>
						<h3 class="font-medium">Group Management</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Organize interns into logical groups for better coordination and management
						</p>
					</div>
				</div>
				
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						<Calendar size={16} />
					</div>
					<div>
						<h3 class="font-medium">Agenda Management</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Schedule and publish events, workshops, and activities on the platform
						</p>
					</div>
				</div>
				
				<div class="flex items-start gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
						<MailCheck size={16} />
					</div>
					<div>
						<h3 class="font-medium">Application Tracking</h3>
						<p class="text-sm text-muted-foreground mt-1">
							Monitor application statuses and communicate with candidates seamlessly
						</p>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- System Information -->
	<Card.Root>
		<Card.Header>
			<div class="flex items-center gap-2">
				<Info class="h-5 w-5 text-muted-foreground" />
				<Card.Title>System Information</Card.Title>
			</div>
			<Card.Description>Technical details about the platform</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-4">
					<div class="rounded-lg bg-muted p-4">
						<div class="mb-1 text-sm font-medium">Version</div>
						<div class="flex items-center justify-between">
							<span class="text-2xl font-semibold">{PUBLIC_PLATFORM_VERSION}</span>
							<Badge variant="outline">Stable</Badge>
						</div>
					</div>
					
					<div class="rounded-lg bg-muted p-4">
						<div class="mb-1 text-sm font-medium">Last Updated</div>
						<div class="flex items-center justify-between">
							<span>{PUBLIC_PLATFORM_UPDATED_AT}</span>
							<Button variant="secondary" size="sm" class="gap-1">
								Changelog
								<ArrowUpRight class="h-3 w-3" />
							</Button>
						</div>
					</div>
				</div>
				
				<div class="space-y-4">
					<div class="rounded-lg bg-muted p-4">
						<div class="mb-1 text-sm font-medium">Support</div>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<LifeBuoy class="h-4 w-4 text-muted-foreground" />
								<a href={`mailto:${PUBLIC_SUPPORT_EMAIL}`} class="text-primary hover:underline">
									{PUBLIC_SUPPORT_EMAIL}
								</a>
							</div>
							<Button variant="secondary" size="sm" class="gap-1">
								Contact
								<ArrowUpRight class="h-3 w-3" />
							</Button>
						</div>
					</div>
					
					<div class="rounded-lg bg-muted p-4">
						<div class="mb-1 text-sm font-medium">Contributors</div>
						<div class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<Github class="h-4 w-4 text-muted-foreground" />
									<a 
										href="https://github.com/AlexDev404" 
										target="_blank" 
										rel="noopener noreferrer"
										class="text-primary hover:underline"
									>
										AlexDev404
									</a>
								</div>
								<Button variant="ghost" size="sm" class="h-7 gap-1">
									View Profile
									<ArrowUpRight class="h-3 w-3" />
								</Button>
							</div>
							
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<Github class="h-4 w-4 text-muted-foreground" />
									<a 
										href="https://github.com/Lee26Ed" 
										target="_blank" 
										rel="noopener noreferrer"
										class="text-primary hover:underline"
									>
										Lee26Ed
									</a>
								</div>
								<Button variant="ghost" size="sm" class="h-7 gap-1">
									View Profile
									<ArrowUpRight class="h-3 w-3" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
