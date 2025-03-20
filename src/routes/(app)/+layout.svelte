<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	let props = $props();
	const data = props.data;
	const authenticated = data.authenticated;
</script>

<Navigation {authenticated} />

{@render props.children()}
