<script lang="ts">
	interface NavShardProps {
		title: string;
		children?: import('svelte').Snippet;
	}
	let { title: shard_title, children }: NavShardProps = $props();
</script>

<nav-shard class="flex flex-col items-start gap-2 self-stretch px-8 pt-4">
	<augmented-text class="flex items-center justify-start gap-1 text-muted-foreground">
		<slot name="icon" />
		<p>{shard_title}</p>
	</augmented-text>

	<nav-frame class="flex items-end justify-between self-stretch">
		<slot name="shards" />
	</nav-frame>
</nav-shard>
