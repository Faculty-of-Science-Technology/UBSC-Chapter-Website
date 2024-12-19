<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import { Pagination as PaginationPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		count = 0,
		perPage = 10,
		page = $bindable(1),
		centered = false,
		siblingCount = 1,
		...restProps
	}: PaginationPrimitive.RootProps & { centered?: boolean } = $props();
</script>

<PaginationPrimitive.Root
	bind:ref
	class={cn('flex w-full flex-col', centered ? 'mx-auto items-center' : '') + className}
	{count}
	{perPage}
	{siblingCount}
	bind:page
	{...restProps}
/>
