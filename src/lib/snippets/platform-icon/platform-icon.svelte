<script lang="ts">
	import { Github, Globe, Linkedin, Plus, Twitter } from 'lucide-svelte';

	const { social } = $props<{ social: string }>();
</script>

{#if social === 'github'}
	<Github size="24" />
{:else if social === 'linkedin'}
	<Linkedin size="24" />
{:else if social === 'twitter'}
	<Twitter size="24" />
{:else if social === 'website'}
	<Globe size="24" />
{:else}
	<Plus size="24" />
{/if}
