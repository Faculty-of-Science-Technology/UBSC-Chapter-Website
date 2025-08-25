<!-- Description: Navigation bar for the public pages of the website. -->
<script lang="ts">
	import Logo from '$lib/components/global/branding/logo.svelte';
	import NavigationLinks from '$lib/components/global/navigation/navigation-links.svelte';
	import { Button } from '$lib/components/vendor/ui/button';
	import { MailOpen } from 'lucide-svelte';
</script>

<component
	class="flex text-slate-50 bg-sky-950 justify-between items-center px-4 lg:px-20 xl:px-80 py-2 w-full"
>
	<Logo mode="dark" />
	<NavigationLinks />
	<Button class="bg-sky-500 hover:bg-sky-600">
		<MailOpen class="mr-2 h-4 w-4" />
		<span>Login with Email</span>
	</Button>
</component>
