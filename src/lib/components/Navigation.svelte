<script>
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	import Logo from './Logo.svelte';
</script>

<nav class="flex items-center gap-4 self-stretch border border-b-slate-300 bg-slate-50 px-8 py-2 w-full">
	<a href="/"><Logo /></a>
	<div class="flex-grow"></div>
	<!-- <a href="/login" class="text-slate-400 hover:text-slate-500">Login</a> -->
	<Button onclick={() => goto('/dashboard')}>Dashboard</Button>
</nav>
