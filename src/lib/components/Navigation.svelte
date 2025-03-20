<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button';
	import Logo from './Logo.svelte';
	interface NavigationProps {
		authenticated: boolean;
	}
	let { authenticated }: NavigationProps = $props();
</script>

<nav
	class="flex sticky top-0 z-10 w-full items-center gap-4 self-stretch border border-b-violet-300 bg-violet-50 px-8 py-2"
>
	<a href="/"><Logo /></a>
	<div class="flex-grow"></div>
	<!-- <a href="/login" class="text-violet-400 hover:text-violet-500">Login</a> -->
	{#if authenticated}
		<a href="/dashboard"><Button>Dashboard</Button></a>
		<a href="/auth/logout"><Button>Logout</Button></a>
	{:else}
		<a href="/auth/login"><Button>Login</Button></a>
		<a href="/auth/register"><Button>Register</Button></a>
	{/if}
</nav>
