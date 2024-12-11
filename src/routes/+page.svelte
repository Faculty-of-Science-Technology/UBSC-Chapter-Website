<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/vendor/ui/button';
	// import * as m from '$lib/paraglide/messages.js';
</script>

<page class="m-8 flex flex-col space-y-5">
	<h1 class="text-archivo text-6xl">Archivo</h1>
	<p>This is a page</p>
	<Button onclick={() => goto('/dashboard')} class="w-fit">Go to dashboard</Button>
</page>
