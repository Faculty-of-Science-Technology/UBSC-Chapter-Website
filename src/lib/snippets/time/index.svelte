<script module lang="ts">
	export { posted_relative_time };

	const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });
	interface IJobPopulated {
		Jobs: {
			CreatedAt: Date;
			Id: string;
			Title: string;
			MinRate: number;
			MaxRate: number;
			Description: string;
			JobTypeId: number | null;
			Draft: boolean;
			UserId: string | null;
		};
		Users: {
			CreatedAt: string;
			Id: string;
			AccountType: 'host' | 'student' | 'owner';
			FirstName: string;
			LastName: string;
			Email: string;
			Password: string;
			ActivationCode: string | null;
			Bio: string | null;
			Hireable: boolean;
		} | null;
		JobTypes: {
			CreatedAt: Date;
			Id: number;
			Name: string;
		} | null;
	}
</script>

{#snippet posted_relative_time(job: IJobPopulated)}
	{#if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / 1000) < 60}
		<p>
			{rtf1.format(
				Math.round((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / 1000),
				'seconds'
			)}
		</p>
	{:else if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60)) < 60}
		<p>
			{rtf1.format(
				Math.round((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60)),
				'minutes'
			)}
		</p>
	{:else if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60)) < 24}
		<p>
			{rtf1.format(
				Math.round((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60)),
				'hours'
			)}
		</p>
	{:else if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) < 30}
		<p>
			{rtf1.format(
				Math.round((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
				'days'
			)}
		</p>
	{:else if Math.abs((new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)) < 12}
		<p>
			{rtf1.format(
				Math.round(
					(new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
				),
				'months'
			)}
		</p>
	{:else}
		<p>
			{rtf1.format(
				Math.round(
					(new Date(job.Jobs.CreatedAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 365)
				),
				'years'
			)}
		</p>
	{/if}
{/snippet}
