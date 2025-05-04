<script lang="ts">
	type PresentationEvent = {
		Id: string;
		CreatedAt: Date;
		Title: string;
		Subtitle: string | null;
		Body: string;
		StartTime: Date;
		EndTime: Date;
		AgendaId: string | null;
		SpeakerName: string | null;
	};

	type Agenda = {
		Id: string;
		CreatedAt: Date;
		Title: string;
		UserId: string | null;
		Subtitle: string | null;
		Body: string;
		StartTime: Date;
		EndTime: Date;
		groups: {
			Id: string;
			CreatedAt: Date;
			Title: string;
			AgendaId: string | null;
		}[];
		events: PresentationEvent[];
	};

	type AgendaPropsData = {
		groupId: number;
		groupCreatedAt: Date;
		groupName: string;
		agenda: Agenda;
	};

	type PropsData = {
		agenda_data: AgendaPropsData[];
	};
	const { agenda_data }: PropsData = $props();

	import * as Tabs from '$lib/components/vendor/ui/tabs/index';
	import { Calendar, Clock } from 'lucide-svelte';
</script>

<article
	class="flex w-full flex-col items-start justify-center gap-4 self-stretch rounded-lg border border-muted p-8 text-left"
>
	<h1 class="w-full text-3xl font-semibold lg:w-[775px] lg:text-6xl">
		Explore What Our Interns Have Accomplished
	</h1>
	<p class="text-xl lg:w-[720px]">
		Come explore the diverse experiences and contributions of our final-year IT interns — from both
		the Associate and Bachelor programs — as they present insights from their recently completed
		internships. This event showcases the skills, growth, and professional development of tomorrow's
		tech leaders.
	</p>

	<Tabs.Root value="all" class="w-full">
		<Tabs.List class="grid w-full grid-cols-{agenda_data.length + 1} gap-4">
			<Tabs.Trigger value="all">All Events</Tabs.Trigger>
			{#each agenda_data as group}
				<Tabs.Trigger value={group.groupId.toString()}>{group.groupName}</Tabs.Trigger>
			{/each}
		</Tabs.List>

		<Tabs.Content value="all">
			<div class="mt-8 space-y-8">
				{#each agenda_data as group}
					<div class="rounded-lg border border-muted bg-card p-6">
						<h2 class="mb-4 text-2xl font-bold">{group.agenda.Title}</h2>
						<div class="flex items-center gap-2 text-muted-foreground">
							<Calendar size={16} />
							<span
								>{group.agenda.StartTime.toLocaleDateString()} - {group.agenda.EndTime.toLocaleDateString()}</span
							>
						</div>

						<div class="mt-6 space-y-4">
							{#each group.agenda.events as event}
								<div class="relative flex gap-4 border-l-2 border-primary pb-8 pl-4">
									<div class="absolute -left-[5px] h-3 w-3 rounded-full bg-primary"></div>
									<div class="w-full rounded-lg bg-muted/50 p-4">
										<h3 class="text-lg font-semibold">{event.Title}</h3>
										{#if event.Subtitle}
											<p class="text-sm text-muted-foreground">{event.Subtitle}</p>
										{/if}
										<div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
											<Clock size={14} />
											<span
												>{event.StartTime.toLocaleTimeString()} - {event.EndTime.toLocaleTimeString()}</span
											>
										</div>
										{#if event.SpeakerName}
											<p class="mt-2 text-sm font-medium">Speaker: {event.SpeakerName}</p>
										{/if}
										<p class="mt-2 text-sm">{event.Body}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</Tabs.Content>

		{#each agenda_data as group}
			<Tabs.Content value={group.groupId.toString()}>
				<div class="mt-8">
					<div class="rounded-lg border border-muted bg-card p-6">
						<h2 class="mb-4 text-2xl font-bold">{group.agenda.Title}</h2>
						<div class="flex items-center gap-2 text-muted-foreground">
							<Calendar size={16} />
							<span
								>{group.agenda.StartTime.toLocaleDateString()} - {group.agenda.EndTime.toLocaleDateString()}</span
							>
						</div>

						<div class="mt-6 space-y-4">
							{#each group.agenda.events as event}
								<div class="relative flex gap-4 border-l-2 border-primary pb-8 pl-4">
									<div class="absolute -left-[5px] h-3 w-3 rounded-full bg-primary"></div>
									<div class="w-full rounded-lg bg-muted/50 p-4">
										<h3 class="text-lg font-semibold">{event.Title}</h3>
										{#if event.Subtitle}
											<p class="text-sm text-muted-foreground">{event.Subtitle}</p>
										{/if}
										<div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
											<Clock size={14} />
											<span
												>{event.StartTime.toLocaleTimeString()} - {event.EndTime.toLocaleTimeString()}</span
											>
										</div>
										{#if event.SpeakerName}
											<p class="mt-2 text-sm font-medium">Speaker: {event.SpeakerName}</p>
										{/if}
										<p class="mt-2 text-sm">{event.Body}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</Tabs.Content>
		{/each}
	</Tabs.Root>
</article>
