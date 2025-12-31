<script lang="ts">
	import HeroText from '$lib/templates/landing/widgets/hero-text.svelte';
	import { Calendar, FileText, PlusCircle, SquarePen, Ticket, User, Users } from 'lucide-svelte';
	import type { Component } from 'svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	// Transform server data into display format
	const stats = [
		{
			name: 'Total Members',
			value: data.stats.totalMembers.value.toString(),
			change:
				data.stats.totalMembers.change >= 0
					? `+${data.stats.totalMembers.change}`
					: data.stats.totalMembers.change.toString(),
			changeType: data.stats.totalMembers.changeType,
			icon: 'users'
		},
		{
			name: 'Active Events',
			value: data.stats.activeEvents.value.toString(),
			change:
				data.stats.activeEvents.change >= 0
					? `+${data.stats.activeEvents.change}`
					: data.stats.activeEvents.change.toString(),
			changeType: data.stats.activeEvents.changeType,
			icon: 'calendar'
		},
		{
			name: 'Blog Posts',
			value: data.stats.blogPosts.value.toString(),
			change:
				data.stats.blogPosts.change >= 0
					? `+${data.stats.blogPosts.change}`
					: data.stats.blogPosts.change.toString(),
			changeType: data.stats.blogPosts.changeType,
			icon: 'document'
		},
		{
			name: 'Active Groups',
			value: data.stats.activeGroups.value.toString(),
			change:
				data.stats.activeGroups.change >= 0
					? `+${data.stats.activeGroups.change}`
					: data.stats.activeGroups.change.toString(),
			changeType: data.stats.activeGroups.changeType,
			icon: 'user-group'
		}
	];

	// Use server data for upcoming events

	const upcomingEvents = data.upcomingEvents;

	function getIconPath(iconName: string): Component {
		const icons = {
			users:
				User,
			calendar:
				Calendar,
			document:
			FileText,
			'user-group':
				Users
		};
		return icons[iconName] || icons.users;
	}
</script>

<svelte:head>
	<title>Dashboard Overview - UBSC Chapter</title>
</svelte:head>

<div class="py-6">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Page header -->
		<div class="mb-8">
			<HeroText
				prelude=""
				text_light_blue="Dashboard Overview"
				text=""
				subtitle="Welcome back, {data.user?.FirstName}! Here's what's happening with UBSC."
			/>
			<!-- <h1 class="text-2xl font-bold text-secondary"></h1>
			<p class="mt-1 text-sm text-secondary/80">
				
			</p> -->
		</div>

		<!-- Stats -->
		<div class="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each stats as stat}
				<div class="overflow-hidden rounded-lg border border-muted bg-secondary shadow-sm">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
									<!-- svelte-ignore svelte_component_deprecated -->
					<svelte:component this={getIconPath(stat.icon)} class="h-5 w-5 text-muted" />
									
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="truncate text-sm font-medium text-muted/70">
										{stat.name}
									</dt>
									<dd class="flex items-baseline">
										<div class="text-2xl font-semibold text-muted">
											{stat.value}
										</div>
										<div
											class="ml-2 flex items-baseline text-sm font-semibold {stat.changeType ===
											'increase'
												? 'text-green-600'
												: stat.changeType === 'decrease'
													? 'text-red-600'
													: 'text-muted/50'}"
										>
											{stat.change}
										</div>
									</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Quick Actions -->
		<div class="my-8 rounded-lg border border-primary overflow-clip bg-secondary shadow-sm">
			<div class="border-b border-muted/30 px-6 py-4">
				<h2 class="text-lg font-medium text-muted">Quick Actions</h2>
			</div>
			<div class="p-6">
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
					<a
						href="/dashboard/events/new"
						class="relative flex items-center space-x-3 rounded-lg border-4 border-primary bg-transparent px-6 py-5 shadow-sm transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
					>
						<div class="flex-shrink-0">
							<PlusCircle class="h-6 w-6 text-primary" />
						</div>
						<div class="min-w-0 flex-1">
							<span class="absolute inset-0" aria-hidden="true"></span>
							<p class="text-sm font-medium text-muted">New Event</p>
						</div>
					</a>

					<a
						href="/dashboard/posts/new"
						class="relative flex items-center space-x-3 rounded-lg border-4 border-primary bg-transparent px-6 py-5 shadow-sm transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
					>
						<div class="flex-shrink-0">
						<SquarePen class="h-6 w-6 text-primary" />
						</div>
						<div class="min-w-0 flex-1">
							<span class="absolute inset-0" aria-hidden="true"></span>
							<p class="text-sm font-medium text-muted">New Post</p>
						</div>
					</a>

					<a
						href="/dashboard/groups/new"
						class="relative flex items-center space-x-3 rounded-lg border-4 border-primary bg-transparent px-6 py-5 shadow-sm transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
					>
						<div class="flex-shrink-0">
							<Users class="h-6 w-6 text-primary" />
						</div>
						<div class="min-w-0 flex-1">
							<span class="absolute inset-0" aria-hidden="true"></span>
							<p class="text-sm font-medium text-muted">New Group</p>
						</div>
					</a>

					{#if data.user?.Permissions.CanManageInvites}
						<a
							href="/dashboard/admin/invites"
							class="relative flex items-center space-x-3 rounded-lg border-4 border-primary bg-transparent px-6 py-5 shadow-sm transition-colors hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
						>
							<div class="flex-shrink-0">
								<Ticket class="h-6 w-6 text-primary" />
							</div>
							<div class="min-w-0 flex-1">
								<span class="absolute inset-0" aria-hidden="true"></span>
								<p class="text-sm font-medium text-muted">Manage Invites</p>
							</div>
						</a>
					{/if}
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8">
			<!-- Upcoming Events -->
			<div class="rounded-lg border border-primary overflow-clip bg-secondary shadow-sm">
				<div class="border-b border-muted/30 px-6 py-4">
					<h2 class="text-lg font-medium text-muted">Upcoming Events</h2>
				</div>
				<div class="divide-y divide-primary/30">
					{#if upcomingEvents.length > 0}
						{#each upcomingEvents as event}
							<div class="px-6 py-4">
								<div class="flex items-center justify-between">
									<div class="min-w-0 flex-1">
										<h3 class="truncate text-sm font-medium text-muted">
											{event.title}
										</h3>
										<div class="mt-1 flex items-center space-x-2 text-xs text-muted/70">
											<span>{event.date}</span>
											<span>•</span>
											<span>{event.time}</span>
											<span>•</span>
											<span>{event.location}</span>
										</div>
									</div>
									<div class="flex-shrink-0 text-right">
										<div class="text-sm font-medium text-secondary">
											{event.attendees} attending
										</div>
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<div class="px-6 py-8 text-center">
							<p class="text-sm text-muted">No upcoming events scheduled</p>
						</div>
					{/if}
				</div>
				<div class="border-t border-primary/30 bg-background px-6 py-3">
					<a href="/dashboard/events" class="text-sm font-medium text-primary hover:text-primary/80">
						View all events →
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
