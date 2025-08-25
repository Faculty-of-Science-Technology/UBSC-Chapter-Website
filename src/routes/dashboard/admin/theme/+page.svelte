<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let loading = $state(false);
	let previewMode = $state(false);

	// Theme form data
	let themeData = $state({
		...data.currentTheme
	});

	const colorSections = [
		{
			title: 'Primary Colors',
			colors: [
				{
					key: 'primaryColor',
					label: 'Primary Color',
					description: 'Main brand color used for buttons and highlights'
				},
				{
					key: 'secondaryColor',
					label: 'Secondary Color',
					description: 'Secondary brand color for accents'
				},
				{
					key: 'accentColor',
					label: 'Accent Color',
					description: 'Color for special highlights and call-to-actions'
				}
			]
		},
		{
			title: 'Background & Text',
			colors: [
				{ key: 'backgroundColor', label: 'Background Color', description: 'Main background color' },
				{ key: 'textColor', label: 'Text Color', description: 'Primary text color' },
				{
					key: 'headerColor',
					label: 'Header Color',
					description: 'Header and navigation background'
				},
				{ key: 'sidebarColor', label: 'Sidebar Color', description: 'Sidebar background color' }
			]
		},
		{
			title: 'Interactive Elements',
			colors: [
				{
					key: 'linkColor',
					label: 'Link Color',
					description: 'Color for links and clickable text'
				},
				{
					key: 'buttonColor',
					label: 'Button Color',
					description: 'Default button background color'
				}
			]
		},
		{
			title: 'Status Colors',
			colors: [
				{
					key: 'successColor',
					label: 'Success Color',
					description: 'Color for success messages and positive actions'
				},
				{
					key: 'warningColor',
					label: 'Warning Color',
					description: 'Color for warnings and caution messages'
				},
				{
					key: 'errorColor',
					label: 'Error Color',
					description: 'Color for errors and destructive actions'
				}
			]
		}
	];

	async function saveTheme() {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/theme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'save', ...themeData })
			});

			if (response.ok) {
				await invalidateAll();
				alert('Theme settings saved successfully!');
			} else {
				const error = await response.text();
				alert('Error saving theme: ' + error);
			}
		} catch (error) {
			alert('Error saving theme: ' + error);
		} finally {
			loading = false;
		}
	}

	async function resetToDefault() {
		if (
			!confirm(
				'Are you sure you want to reset to default theme? This will overwrite all custom settings.'
			)
		)
			return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/theme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'reset' })
			});

			if (response.ok) {
				await invalidateAll();
				themeData = { ...data.currentTheme };
				alert('Theme reset to default successfully!');
			} else {
				const error = await response.text();
				alert('Error resetting theme: ' + error);
			}
		} catch (error) {
			alert('Error resetting theme: ' + error);
		} finally {
			loading = false;
		}
	}

	function generateCSSVariables() {
		return `
:root {
  --primary-color: ${themeData.primaryColor};
  --secondary-color: ${themeData.secondaryColor};
  --accent-color: ${themeData.accentColor};
  --background-color: ${themeData.backgroundColor};
  --text-color: ${themeData.textColor};
  --header-color: ${themeData.headerColor};
  --sidebar-color: ${themeData.sidebarColor};
  --link-color: ${themeData.linkColor};
  --button-color: ${themeData.buttonColor};
  --success-color: ${themeData.successColor};
  --warning-color: ${themeData.warningColor};
  --error-color: ${themeData.errorColor};
}`.trim();
	}

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: null;
	}

	function isLightColor(hex: string) {
		const rgb = hexToRgb(hex);
		if (!rgb) return true;
		const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
		return brightness > 128;
	}
</script>

<svelte:head>
	<title>Theme Settings - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl font-semibold leading-6 text-gray-900">Theme Settings</h1>
			<p class="mt-2 text-sm text-gray-700">
				Customize the appearance and branding of your chapter website.
			</p>
		</div>
		<div class="mt-4 space-x-3 sm:ml-16 sm:mt-0 sm:flex-none">
			<button
				type="button"
				onclick={() => (previewMode = !previewMode)}
				class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				{previewMode ? 'Exit Preview' : 'Preview'}
			</button>
			<button
				type="button"
				onclick={resetToDefault}
				disabled={loading}
				class="inline-flex items-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 disabled:opacity-50"
			>
				Reset to Default
			</button>
			<button
				type="button"
				onclick={saveTheme}
				disabled={loading}
				class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
			>
				{loading ? 'Saving...' : 'Save Theme'}
			</button>
		</div>
	</div>

	<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Color Settings -->
		<div class="space-y-8">
			{#each colorSections as section}
				<div class="rounded-lg bg-white p-6 shadow">
					<h3 class="mb-4 text-lg font-medium text-gray-900">{section.title}</h3>
					<div class="space-y-4">
						{#each section.colors as color}
							<div class="flex items-center justify-between">
								<div class="min-w-0 flex-1">
									<label for={color.key} class="block text-sm font-medium text-gray-700">
										{color.label}
									</label>
									<p class="mt-1 text-xs text-gray-500">{color.description}</p>
								</div>
								<div class="ml-4 flex items-center space-x-3">
									<div
										class="h-10 w-10 rounded-lg border-2 border-gray-200 shadow-sm"
										style="background-color: {themeData[color.key]};"
									></div>
									<input
										type="color"
										id={color.key}
										bind:value={themeData[color.key]}
										class="h-10 w-12 rounded border-gray-300 shadow-sm"
									/>
									<input
										type="text"
										bind:value={themeData[color.key]}
										class="w-20 rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
									/>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<!-- Preview and Additional Settings -->
		<div class="space-y-8">
			<!-- Theme Preview -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">Theme Preview</h3>
				<div class="space-y-4">
					<!-- Header Preview -->
					<div
						class="rounded-lg p-4"
						style="background-color: {themeData.headerColor}; color: {isLightColor(
							themeData.headerColor
						)
							? themeData.textColor
							: '#FFFFFF'};"
					>
						<h4 class="font-semibold">UBSC Chapter Header</h4>
						<p class="text-sm opacity-90">Navigation and branding area</p>
					</div>

					<!-- Content Preview -->
					<div
						class="rounded-lg border p-4"
						style="background-color: {themeData.backgroundColor}; color: {themeData.textColor}; border-color: {themeData.primaryColor}20;"
					>
						<h4 class="mb-2 font-semibold">Sample Content</h4>
						<p class="mb-3 text-sm">
							This is how your content will look with the current theme settings.
						</p>

						<div class="space-y-2">
							<button
								class="rounded px-3 py-1 text-sm text-white"
								style="background-color: {themeData.buttonColor};"
							>
								Primary Button
							</button>

							<a href="#" class="block text-sm" style="color: {themeData.linkColor};">
								Sample Link
							</a>

							<div class="flex space-x-2 text-xs">
								<span
									class="rounded px-2 py-1 text-white"
									style="background-color: {themeData.successColor};"
								>
									Success
								</span>
								<span
									class="rounded px-2 py-1 text-white"
									style="background-color: {themeData.warningColor};"
								>
									Warning
								</span>
								<span
									class="rounded px-2 py-1 text-white"
									style="background-color: {themeData.errorColor};"
								>
									Error
								</span>
							</div>
						</div>
					</div>

					<!-- Sidebar Preview -->
					<div
						class="rounded-lg p-4"
						style="background-color: {themeData.sidebarColor}; color: {themeData.textColor};"
					>
						<h4 class="mb-2 font-semibold">Sidebar Area</h4>
						<p class="text-sm">Dashboard navigation and secondary content</p>
					</div>
				</div>
			</div>

			<!-- Branding Settings -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">Branding</h3>
				<div class="space-y-4">
					<div>
						<label for="logoUrl" class="block text-sm font-medium text-gray-700">Logo URL</label>
						<input
							type="url"
							id="logoUrl"
							bind:value={themeData.logoUrl}
							placeholder="https://example.com/logo.png"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
						<p class="mt-1 text-xs text-gray-500">URL to your chapter logo image</p>
					</div>

					<div>
						<label for="faviconUrl" class="block text-sm font-medium text-gray-700"
							>Favicon URL</label
						>
						<input
							type="url"
							id="faviconUrl"
							bind:value={themeData.faviconUrl}
							placeholder="https://example.com/favicon.ico"
							class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
						/>
						<p class="mt-1 text-xs text-gray-500">URL to your website favicon</p>
					</div>
				</div>
			</div>

			<!-- Custom CSS -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">Custom CSS</h3>
				<div class="space-y-4">
					<div>
						<label for="customCss" class="block text-sm font-medium text-gray-700"
							>Additional CSS</label
						>
						<textarea
							id="customCss"
							bind:value={themeData.customCss}
							rows="8"
							class="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
							placeholder="/* Add your custom CSS here */"
						></textarea>
						<p class="mt-1 text-xs text-gray-500">
							Advanced: Add custom CSS to further customize your theme
						</p>
					</div>
				</div>
			</div>

			<!-- CSS Variables Export -->
			<div class="rounded-lg bg-white p-6 shadow">
				<h3 class="mb-4 text-lg font-medium text-gray-900">CSS Variables</h3>
				<div class="space-y-4">
					<p class="text-sm text-gray-600">
						These CSS variables are generated from your theme settings:
					</p>
					<pre
						class="overflow-x-auto rounded-lg bg-gray-50 p-3 font-mono text-xs">{generateCSSVariables()}</pre>
					<button
						type="button"
						onclick={() => navigator.clipboard.writeText(generateCSSVariables())}
						class="text-sm text-indigo-600 hover:text-indigo-900"
					>
						Copy CSS Variables
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

{#if previewMode}
	<!-- Theme Preview Overlay -->
	<div
		class="fixed inset-0 z-50"
		style="background-color: {themeData.backgroundColor}; color: {themeData.textColor};"
	>
		<div
			class="flex h-16 items-center justify-between px-6"
			style="background-color: {themeData.headerColor}; color: {isLightColor(themeData.headerColor)
				? themeData.textColor
				: '#FFFFFF'};"
		>
			<div class="flex items-center">
				<h1 class="text-xl font-bold">UBSC Chapter</h1>
			</div>
			<button
				onclick={() => (previewMode = false)}
				class="rounded bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
			>
				Exit Preview
			</button>
		</div>

		<div class="flex h-[calc(100vh-4rem)]">
			<div class="w-64 p-4" style="background-color: {themeData.sidebarColor};">
				<h3 class="mb-4 font-semibold">Navigation</h3>
				<div class="space-y-2">
					<a
						href="#"
						class="block rounded p-2 hover:bg-gray-200"
						style="color: {themeData.linkColor};">Dashboard</a
					>
					<a
						href="#"
						class="block rounded p-2 hover:bg-gray-200"
						style="color: {themeData.linkColor};">Events</a
					>
					<a
						href="#"
						class="block rounded p-2 hover:bg-gray-200"
						style="color: {themeData.linkColor};">Blog Posts</a
					>
					<a
						href="#"
						class="block rounded p-2 hover:bg-gray-200"
						style="color: {themeData.linkColor};">Members</a
					>
				</div>
			</div>

			<div class="flex-1 p-6">
				<h2 class="mb-4 text-2xl font-bold">Preview Mode</h2>
				<p class="mb-4">This is how your website will look with the current theme settings.</p>

				<div class="space-y-4">
					<button
						class="rounded px-4 py-2 text-white"
						style="background-color: {themeData.buttonColor};"
					>
						Primary Button
					</button>

					<button
						class="ml-2 rounded px-4 py-2 text-white"
						style="background-color: {themeData.secondaryColor};"
					>
						Secondary Button
					</button>

					<div class="rounded border p-4">
						<h3 class="mb-2 font-semibold">Sample Card</h3>
						<p class="mb-3 text-sm">
							This is a sample card component showing how content will appear.
						</p>
						<a href="#" style="color: {themeData.linkColor};">Learn more →</a>
					</div>

					<div class="flex space-x-2">
						<div
							class="rounded px-3 py-1 text-sm text-white"
							style="background-color: {themeData.successColor};"
						>
							Success message
						</div>
						<div
							class="rounded px-3 py-1 text-sm text-white"
							style="background-color: {themeData.warningColor};"
						>
							Warning message
						</div>
						<div
							class="rounded px-3 py-1 text-sm text-white"
							style="background-color: {themeData.errorColor};"
						>
							Error message
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
