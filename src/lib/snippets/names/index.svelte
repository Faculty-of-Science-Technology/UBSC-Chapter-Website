<script module lang="ts">
	export { nameof__job_creator };
	interface IJobCreator {
		FirstName: string;
		LastName: string;
		Id: string;
		AccountType: 'host' | 'student' | 'owner';
		Email: string;
		Password: string;
		ActivationCode: string | null;
		Bio: string | null;
		Hireable: boolean;
		CreatedAt: string;
	}
</script>

{#snippet nameof__job_creator(job_creator: IJobCreator)}
	{job_creator?.FirstName}{' '}{job_creator?.LastName}
{/snippet}
