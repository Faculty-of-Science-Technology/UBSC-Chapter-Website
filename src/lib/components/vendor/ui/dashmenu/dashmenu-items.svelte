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

<div class={cn('space-y-1 p-1', className)} {...restProps}>
    {@render children?.()}
</div>