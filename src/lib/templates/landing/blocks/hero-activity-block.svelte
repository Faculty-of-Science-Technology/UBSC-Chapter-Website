<script lang="ts">
	interface Props {
		activities_column?: boolean;
	}

	let { activities_column = false }: Props = $props();
</script>

<preload class="hidden flex-col" />
<activity-group
	class="flex sm:flex-row {activities_column ? 'flex-col' : ''} justify-between items-start self-stretch w-full"
>
	<slot />
</activity-group>
