<script lang="ts">
	import * as DashMenu from '$lib/components/vendor/ui/dashmenu/index';
	import MenuItem from '$lib/components/vendor/ui/menuitem/menuitem.svelte';
	import { Separator } from '$lib/components/vendor/ui/separator/index.js';
	import {
		GroupIcon,
		LucideCalendarCog,
		MessageSquareMoreIcon,
		UserIcon,
		Users
	} from 'lucide-svelte';

	let { children } = $props();
</script>

<page class="flex h-svh">
	<DashMenu.Root class="h-full">
		<DashMenu.Content>
			<DashMenu.Heading
				class="text-archivo text-lg font-extralight lg:text-4xl"
				title="Settings & Privacy"
			/>
			<DashMenu.Items>
				<MenuItem noborder title="Your Profile">
					<svelte:fragment slot="start-icon">
						<UserIcon class="size-5" />
					</svelte:fragment>

					⇧⌘P</MenuItem
				>
				<MenuItem noborder title="Notifications">
					<svelte:fragment slot="start-icon">
						<MessageSquareMoreIcon class="size-5" />
					</svelte:fragment>
					⇧⌘N</MenuItem
				>
				<Separator />
				<DashMenu.Heading class="text-md" title="Administrative Tasks" />
				<MenuItem noborder title="Manage Agenda">
					<svelte:fragment slot="start-icon">
						<LucideCalendarCog class="size-5" />
					</svelte:fragment>

					⇧⌘A</MenuItem
				>
				<MenuItem noborder title="Manage Users">
					<svelte:fragment slot="start-icon">
						<Users class="size-5" />
					</svelte:fragment>
					⇧⌘U</MenuItem
				>
				<MenuItem noborder title="Manage Groups">
					<svelte:fragment slot="start-icon">
						<GroupIcon class="size-5" />
					</svelte:fragment>

					⇧⌘G</MenuItem
				>
			</DashMenu.Items>
		</DashMenu.Content>
	</DashMenu.Root>
	<main class="flex-1 bg-gray-100 p-8">
		{@render children?.()}
	</main>
</page>
