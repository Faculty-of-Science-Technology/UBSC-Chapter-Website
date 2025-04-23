<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button/index.js';
	import * as Card from '$lib/components/vendor/ui/card/index.js';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

    
	export let data: PageData;
    const { enhance, errors, message } = superForm(data.form);
</script>

<page class="flex h-screen w-full flex-col items-center justify-center">
	<main>
		<Card.Root class="w-[350px]">
			<Card.Header>
				<Card.Title>Join group</Card.Title>
				<Card.Description
					>You've been invited to join a group.<br />Confirm your presence below.</Card.Description
				>
			</Card.Header>
			<Card.Content>
				<form method="POST" action="?/join" use:enhance>
                    <p class="text-sm text-red-500">{$errors.code}</p>
					<p class="text-sm text-green-500">{$message}</p>
                    <input type="hidden" name="code" value="00000000-0000-0000-0000-000000000000" />
					<div class="flex gap-2">
                        <Button type="submit" class="w-full">Deploy</Button>
						<Button variant="outline">Cancel</Button>
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</main>
</page>
