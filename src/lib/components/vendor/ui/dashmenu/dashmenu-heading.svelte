<script lang="ts">
	import { Separator } from '$lib/components/vendor/ui/separator/index.js';
	import { cn } from '$lib/components/vendor/utils.js';
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		ref = $bindable(null),
		title,
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { title: string } = $props();
</script>

<div class={cn('mb-2 text-sm font-semibold', className)} {...restProps}>
	<div class="py-1.5 pl-4">{title}</div>
	<Separator />
</div>
