<script lang="ts">
	import { cn } from '$lib/components/vendor/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	interface NavShardLinkProps extends HTMLAttributes<HTMLButtonElement> {
		title: string;
		active?: boolean;
	}
	let { title: link_title, active, ...restProps }: NavShardLinkProps = $props();
</script>

<button
	class={cn(
		'mx-0.5 flex flex-col items-start justify-center rounded-t-lg px-10 py-2 text-center hover:border-b-2 hover:border-slate-400',
		active ? 'border-b-2 border-slate-900' : ''
	)}
	{...restProps}
>
	<p class="inter w-full text-base font-medium">{link_title}</p>
	<!-- <underline class="h-1 w-full bg-black"></underline> -->
</button>
