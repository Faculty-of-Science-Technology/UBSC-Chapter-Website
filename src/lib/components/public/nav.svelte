<!-- Description: Navigation bar for the public pages of the website. -->
<script lang="ts">
	import Logo from '$lib/components/global/branding/logo.svelte';
	import NavigationLinks from '$lib/components/global/navigation/navigation-links.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
</script>

<component
	class="flex w-full items-center justify-between bg-secondary px-4 py-2 text-slate-50 lg:px-20 xl:px-60"
>
	<a href="/">
		<Logo mode="dark" />
	</a>
	<NavigationLinks />
	<a href="/auth/login">
		<Button class="bg-primary hover:bg-primary/80">
			<span>Login</span>
		</Button>
	</a>
</component>
