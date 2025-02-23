import About from './about.svelte';
import Archives from './archives.svelte';
import Home from './home.svelte';
import HostOrganizations from './host-organizations.svelte';
import Interns from './interns.svelte';
import PresentationAgenda from './presentation-agenda.svelte';

export interface AvatarData {
	id: string;
	image_url: string;
	name: string;
	bio: string | null;
	hireable: boolean;
}

export { About, Archives, Home, HostOrganizations, Interns, PresentationAgenda };
