<script lang="ts">
	import {
		PUBLIC_PLATFORM_CONSOLE_URL,
		PUBLIC_PLATFORM_UPDATED_AT,
		PUBLIC_PLATFORM_VERSION
	} from '$env/static/public';
	import { Toaster } from '$lib/components/vendor/ui/sonner';
	import { ExternalLink } from 'lucide-svelte';
	import '../app.css';
	import type { LayoutData } from './$types';
	let props = $props();
	const { data }: { data: LayoutData } = props;
</script>

{#if data.debug}
	<p
		class="flex items-center justify-center gap-2 bg-orange-400 py-1.5 text-center text-sm font-medium text-black dark:bg-orange-700 dark:text-background"
	>
		<span
			>Development build ({PUBLIC_PLATFORM_VERSION}@{PUBLIC_PLATFORM_UPDATED_AT}) - Expect to see
			some weird errors and bugs!</span
		>

		<a
			href={PUBLIC_PLATFORM_CONSOLE_URL}
			class="flex w-fit items-center justify-center gap-1 font-semibold underline"
			>Open Console <ExternalLink size="16" />
		</a>
	</p>
{/if}

<Toaster />
{@render props.children()}

<style>
	:root {
		--radius: 0.65rem;
		--background: 0 0% 100%;
		--foreground: 240 10% 4%;
		--card: oklch(1 0 0);
		--card-foreground: oklch(0.141 0.005 285.823);
		--popover: 205 74% 95%;
		--popover-foreground: oklch(0.141 0.005 285.823);
		--primary: 199 89% 48%; /* modified */
		--primary-foreground: oklch(0.982 0.018 155.826);
		--secondary: 204 83% 16%; /* modified */
		--secondary-foreground: oklch(0.21 0.006 285.885);
		--accent-foreground: 205 74% 95%;
		--muted: 205 74% 95%;
		--muted-foreground: 205 60% 92%;
		--accent: 199 89% 48%;
		--accent-foreground: 205 74% 95%;
		--destructive: oklch(0.577 0.245 27.325);
		--border: oklch(0.92 0.004 286.32);
		--input: oklch(0.92 0.004 286.32);
		--ring: oklch(0.723 0.219 149.579);
		--chart-1: oklch(0.646 0.222 41.116);
		--chart-2: oklch(0.6 0.118 184.704);
		--chart-3: oklch(0.398 0.07 227.392);
		--chart-4: oklch(0.828 0.189 84.429);
		--chart-5: oklch(0.769 0.188 70.08);
		--sidebar: oklch(0.985 0 0);
		--sidebar-foreground: oklch(0.141 0.005 285.823);
		--sidebar-primary: oklch(0.723 0.219 149.579);
		--sidebar-primary-foreground: oklch(0.982 0.018 155.826);
		--sidebar-accent: oklch(0.967 0.001 286.375);
		--sidebar-accent-foreground: oklch(0.21 0.006 285.885);
		--sidebar-border: oklch(0.92 0.004 286.32);
		--sidebar-ring: oklch(0.723 0.219 149.579);
	}
</style>
