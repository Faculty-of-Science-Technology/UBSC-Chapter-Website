<script lang="ts">
	import { Toaster } from '$lib/components/vendor/ui/sonner';
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	let props = $props();
</script>

<ParaglideJS {i18n}>
	<Toaster />
	{@render props.children()}
</ParaglideJS>
