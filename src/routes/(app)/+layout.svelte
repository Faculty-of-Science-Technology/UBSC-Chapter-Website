<script lang="ts">
	import PublicNav from '$lib/components/public/nav.svelte';
	let props = $props();
</script>

<PublicNav />
{@render props.children()}
