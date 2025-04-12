import adapter from '@sveltejs/adapter-node';
import { default as adapter_vercel } from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Determine which adapter to use based on DEVELOPMENT env variable
const isDevelopment = process.env.DEVELOPMENT === 'true';
const selectedAdapter = isDevelopment ? adapter_vercel : adapter;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	compilerOptions: {
		customElement: true
	},
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: selectedAdapter()
	}
};

export default config;
