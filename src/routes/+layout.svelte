<script lang="ts">
	import {
		PUBLIC_PLATFORM_CONSOLE_URL,
		PUBLIC_PLATFORM_UPDATED_AT,
		PUBLIC_PLATFORM_VERSION
	} from '$env/static/public';
	import { Toaster } from '$lib/components/vendor/ui/sonner';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { ExternalLink } from 'lucide-svelte';
	import '../app.css';
	import type { PageProps } from './$types';
	let props = $props();
	const { data }: PageProps = props;
</script>

{#if data.debug}
	<p
		class="flex items-center gap-2 justify-center bg-orange-400 py-1.5 text-center text-sm font-medium text-black dark:bg-orange-700 dark:text-white"
	>
		<span>Development build ({PUBLIC_PLATFORM_VERSION}@{PUBLIC_PLATFORM_UPDATED_AT}) - Expect to see some
		weird errors and bugs!</span>
		
		<a
			href={PUBLIC_PLATFORM_CONSOLE_URL}
			class="flex w-fit items-center gap-1 justify-center font-semibold underline"
			>Open Console <ExternalLink size="16" />
		</a>
	</p>
{/if}
<ParaglideJS {i18n}>
	<Toaster />
	{@render props.children()}
</ParaglideJS>
