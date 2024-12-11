<script lang="ts">
	import Navigation from '$lib/components/Navigation.svelte';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	let { children } = $props();
</script>

<Navigation/>
<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
