<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		active = false as boolean,
		title = '' as string,
		ref = $bindable(null),
		class: className = '' as string,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLButtonElement>> & {
		active?: boolean;
		title: string;
	} = $props();
</script>

<li class="nav-item" role="presentation">
	<button
		bind:this={ref}
		class={cn(
			'nav-link rounded-t-md border px-4 py-2 hover:border-gray-100',
			className,
			active ? 'border border-b-0 border-gray-200 bg-background' : 'border-b-0 border-background'
		)}
		style="height: calc(100% + 1px);"
		type="button"
		role="tab"
		aria-selected="false"
		tabindex="-1"
		{...restProps}>{title}</button
	>
</li>
