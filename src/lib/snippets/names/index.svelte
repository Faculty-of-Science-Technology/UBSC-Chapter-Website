<script module lang="ts">
	import { goto } from '$app/navigation';

	export { nameof__job_creator, nameof__person };
	export interface IJobCreator {
		Id: string;
		AccountType: 'org' | 'student' | 'owner';
		Administrator: boolean;
		FirstName: string;
		LastName: string;
		Email: string;
		Phone: string;
		ProfilePicture: string;
		CoverPhoto: string;
		Username: string;
		Password: string;
		ActivationCode: string | null;
		Bio: string;
		Hireable: boolean;
		CreatedAt: Date;
	}
</script>

{#snippet nameof__job_creator(job_creator: IJobCreator)}
	<p
		class="cursor-pointer underline hover:no-underline"
		onclick={() => goto(`/dashboard/organizations/${job_creator?.Id}`)}
	>
		{job_creator?.FirstName}{' '}{job_creator?.LastName}
	</p>
	{#if job_creator?.AccountType === 'org'}
		<p class="text-xs text-slate-400">({job_creator?.AccountType})</p>
	{/if}
	{/snippet}
	
	{#snippet nameof__person(person: IJobCreator)}
	<p
		class="cursor-pointer underline hover:no-underline"
		onclick={() => goto(`/dashboard/people/${person?.Id}`)}
	>
		{person?.FirstName}{' '}{person?.LastName}
	</p>
	{#if person?.AccountType === 'org'}
		<p class="text-xs text-slate-400">({person?.AccountType})</p>
	{/if}
	
{/snippet}
