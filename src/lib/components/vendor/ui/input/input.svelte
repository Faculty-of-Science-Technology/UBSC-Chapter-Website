<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		value = $bindable(),
		checked = $bindable(),
		class: className,
		type = 'text',
		...restProps
	}: WithElementRef<HTMLInputAttributes> = $props();
</script>

{#if type !== 'checkbox' && type !== 'radio'}
	<input
		bind:this={ref}
		class={cn(
			'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:value
		{type}
		{...restProps}
	/>
{:else}
	<input
		bind:this={ref}
		class={cn(
			'peer h-4 w-4 rounded border border-input bg-transparent text-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
			className
		)}
		bind:checked
		type="checkbox"
		{...restProps}
	/>
{/if}
