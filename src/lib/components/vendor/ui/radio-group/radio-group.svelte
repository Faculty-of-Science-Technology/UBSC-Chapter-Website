<script lang="ts">
	import { cn } from '$lib/components/vendor/utils.js';
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: RadioGroupPrimitive.RootProps = $props();
</script>

<RadioGroupPrimitive.Root class={cn('grid gap-2', className)} {...restProps} bind:ref />
