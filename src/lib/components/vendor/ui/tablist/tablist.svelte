<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
	bind:this={ref}
	{...restProps}
	class={cn('nav nav-tabs flex w-full border-b border-gray-200', className)}
	role="tablist"
	style="height: calc(100% - 1px);"
>
	{@render children?.()}
</ul>
