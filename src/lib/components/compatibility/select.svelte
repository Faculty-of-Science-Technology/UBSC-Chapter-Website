<script lang="ts">
	import { cn } from '$lib/components/vendor/utils';
	let { class: className, value = $bindable(), ...restProps } = $props();
</script>

<select
	class={cn(
		'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm text-muted-foreground shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...restProps}
>
	<slot />
</select>
