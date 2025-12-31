<script lang="ts">
	import Button from '$lib/components/vendor/ui/button/button.svelte';
	import { Input } from '$lib/components/vendor/ui/input';
	import { Label } from '$lib/components/vendor/ui/label';
</script>

<component class="w-full">
	<input-combo class="grid w-full items-center gap-1.5">
		<Label for="email-2">Email</Label>
		<div class="flex items-start gap-1.5 self-stretch">
			<Input type="email" id="email-2" placeholder="Enter your email address" />
			<Button class="bg-primary hover:bg-primary/80">Subscribe</Button>
		</div>
		<p class="text-secondary/80 text-sm">Enter your email address.</p>
	</input-combo>
</component>
