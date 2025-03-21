<script module lang="ts">
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
	{job_creator?.FirstName}{' '}{job_creator?.LastName}
{/snippet}

{#snippet nameof__person(person: IJobCreator)}
	{person?.FirstName}{' '}{person?.LastName}
{/snippet}
