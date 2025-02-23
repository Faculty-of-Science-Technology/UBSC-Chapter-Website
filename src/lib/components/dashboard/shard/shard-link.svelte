<script lang="ts">
	import { cn } from '$lib/components/vendor/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface NavShardLinkProps extends HTMLAttributes<HTMLButtonElement> {
		title: string;
		active?: boolean;
		a11yLink?: string;
	}
	let { title: link_title, active, a11yLink, ...rest }: NavShardLinkProps = $props();
</script>

<a href={a11yLink ? a11yLink : '#'}>
	<button
		class={cn(
			'mx-0.5 flex flex-col items-start justify-center rounded-t-lg px-10 py-2 text-center border-b-2 border-transparent hover:border-slate-400',
			active ? 'border-b-2 border-slate-900' : ''
		)}
		{...rest}
	>
		<p class="inter w-full text-base font-medium">{link_title}</p>
		<!-- <underline class="h-1 w-full bg-black"></underline> -->
	</button>
</a>
