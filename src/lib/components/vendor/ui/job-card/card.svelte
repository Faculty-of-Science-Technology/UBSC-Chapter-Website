<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn('overflow-clip rounded-xl border bg-card text-card-foreground shadow', className)}
	{...restProps}
>
	{@render children?.()}
</div>
