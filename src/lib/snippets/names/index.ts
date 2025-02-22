import { nameof__job_creator, nameof__person, type IJobCreator } from './index.svelte';
export { getUserFullName, nameof__job_creator, nameof__person };

function getUserFullName(person: IJobCreator) {
	return `${person?.FirstName} ${person?.LastName}`;
}
