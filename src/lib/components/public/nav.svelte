<!-- Description: Navigation bar for the public pages of the website. -->
<script lang="ts">
	import Logo from '$lib/components/global/branding/logo.svelte';
	import NavigationLinks from '$lib/components/global/navigation/navigation-links.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import { MailOpen } from 'lucide-svelte';
</script>

<component
	class="flex w-full items-center justify-between bg-sky-950 px-4 py-2 text-slate-50 lg:px-20 xl:px-80"
>
	<a href="/">
		<Logo mode="dark" />
	</a>
	<NavigationLinks />
	<a href="/auth/login">
		<Button class="bg-sky-500 hover:bg-sky-600">
			<MailOpen class="mr-2 h-4 w-4" />
			<span>Login with Email</span>
		</Button>
	</a>
</component>
