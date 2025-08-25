<script lang="ts">
	import Logo from '$lib/components/global/branding/logo.svelte';
	import NavigationLinks from '$lib/components/global/navigation/navigation-links.svelte';
	import Button from '$lib/components/vendor/ui/button/button.svelte';
	import {
		faFacebook,
		faInstagram,
		faLinkedin,
		faTwitter,
		faYoutube
	} from '@fortawesome/free-brands-svg-icons';
	import Fa from 'svelte-fa';
</script>

<component
	class="flex flex-col-reverse lg:flex-row justify-between items-center gap-42 self-stretch bg-slate-50 w-full lg:px-20 xl:px-80 py-12"
>
	<div class="flex flex-col items-start gap-8 w-3/4 lg:w-1/2 pt-12">
		<Logo />

		<article
			class="inter text-sm font-light leading-tight flex flex-col items-start justify-center gap-2.5"
		>
			<section>
				The University of Belize's Associate for Computer Machinery (ACM) Chapter (UBACM) at The
				University of Belize is dedicated to upskilling and informing Belizeans about Technology.
			</section>
			<section class="flex justify-center items-center gap-8">
				<a
					href="https://www.facebook.com/UBACMStudentChapter/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Fa icon={faFacebook} />
				</a>
				<a href="https://www.instagram.com/ub_acm/" target="_blank" rel="noopener noreferrer">
					<Fa icon={faInstagram} />
				</a>
				<a href="https://twitter.com/AcmUB" target="_blank" rel="noopener noreferrer">
					<Fa icon={faTwitter} />
				</a>
				<a href="https://www.linkedin.com/company/ubacm/" target="_blank" rel="noopener noreferrer">
					<Fa icon={faLinkedin} />
				</a>
				<a
					href="https://www.youtube.com/channel/UCN3pAPtsyCUL841e5my0PLw"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Fa icon={faYoutube} />
				</a>
			</section>
		</article>
		<Button class="bg-sky-500 hover:bg-sky-600">
			<span>Join Us</span>
		</Button>
	</div>
	<NavigationLinks />
</component>
