<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button';
	import Logo from './Logo.svelte';
</script>

<nav
	class="flex w-full items-center gap-4 self-stretch border border-b-slate-300 bg-slate-50 px-8 py-2"
>
	<a href="/"><Logo /></a>
	<div class="flex-grow"></div>
	<!-- <a href="/login" class="text-slate-400 hover:text-slate-500">Login</a> -->
	<a href="/dashboard"><Button>Dashboard</Button></a>
</nav>
