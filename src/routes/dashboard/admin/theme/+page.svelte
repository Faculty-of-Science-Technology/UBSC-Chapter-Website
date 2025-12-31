<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let loading = $state(false);
	let editingTheme = $state<any>(null);
	let showEditModal = $state(false);

	// Theme form data for editing
	let themeData = $state({
		primaryColor: '#3B82F6',
		secondaryColor: '#1E40AF',
		accentColor: '#F59E0B',
		backgroundColor: '#FFFFFF',
		textColor: '#1F2937',
		headerColor: '#1E40AF',
		sidebarColor: '#F3F4F6',
		linkColor: '#3B82F6',
		buttonColor: '#3B82F6',
		successColor: '#10B981',
		warningColor: '#F59E0B',
		errorColor: '#EF4444',
		logoUrl: '',
		faviconUrl: '',
		customCss: ''
	});

	const colorSections = [
		{
			title: 'Primary Colors',
			colors: [
				{ key: 'primaryColor', label: 'Primary Color' },
				{ key: 'secondaryColor', label: 'Secondary Color' },
				{ key: 'accentColor', label: 'Accent Color' }
			]
		},
		{
			title: 'Background & Text',
			colors: [
				{ key: 'backgroundColor', label: 'Background' },
				{ key: 'textColor', label: 'Text' },
				{ key: 'headerColor', label: 'Header' },
				{ key: 'sidebarColor', label: 'Sidebar' }
			]
		},
		{
			title: 'Interactive',
			colors: [
				{ key: 'linkColor', label: 'Link' },
				{ key: 'buttonColor', label: 'Button' }
			]
		},
		{
			title: 'Status',
			colors: [
				{ key: 'successColor', label: 'Success' },
				{ key: 'warningColor', label: 'Warning' },
				{ key: 'errorColor', label: 'Error' }
			]
		}
	];

	function openEditModal(theme: any = null) {
		if (theme) {
			// Edit existing theme
			editingTheme = theme;
			themeData = {
				primaryColor: theme.primaryColor,
				secondaryColor: theme.secondaryColor,
				accentColor: theme.accentColor,
				backgroundColor: theme.backgroundColor,
				textColor: theme.textColor,
				headerColor: theme.headerColor,
				sidebarColor: theme.sidebarColor,
				linkColor: theme.linkColor,
				buttonColor: theme.buttonColor,
				successColor: theme.successColor,
				warningColor: theme.warningColor,
				errorColor: theme.errorColor,
				logoUrl: theme.logoUrl || '',
				faviconUrl: theme.faviconUrl || '',
				customCss: theme.customCss || ''
			};
		} else {
			// Create new theme
			editingTheme = null;
			themeData = {
				primaryColor: '#3B82F6',
				secondaryColor: '#1E40AF',
				accentColor: '#F59E0B',
				backgroundColor: '#FFFFFF',
				textColor: '#1F2937',
				headerColor: '#1E40AF',
				sidebarColor: '#F3F4F6',
				linkColor: '#3B82F6',
				buttonColor: '#3B82F6',
				successColor: '#10B981',
				warningColor: '#F59E0B',
				errorColor: '#EF4444',
				logoUrl: '',
				faviconUrl: '',
				customCss: ''
			};
		}
		showEditModal = true;
	}

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
				showEditModal = false;
				toast.success('Theme saved successfully!');
			} else {
				const error = await response.text();
				toast.error('Error saving theme: ' + error);
			}
		} catch (error) {
			toast.error('Error saving theme: ' + error);
		} finally {
			loading = false;
		}
	}

	async function selectTheme(themeId: string) {
		loading = true;
		try {
			const response = await fetch('/dashboard/admin/theme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'select', themeId })
			});

			if (response.ok) {
				await invalidateAll();
				toast.success('Theme selected successfully!');
			} else {
				const error = await response.text();
				toast.error('Error selecting theme: ' + error);
			}
		} catch (error) {
			toast.error('Error selecting theme: ' + error);
		} finally {
			loading = false;
		}
	}

	async function deleteTheme(themeId: string) {
		if (!confirm('Are you sure you want to delete this theme?')) return;

		loading = true;
		try {
			const response = await fetch('/dashboard/admin/theme', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'delete', themeId })
			});

			if (response.ok) {
				await invalidateAll();
				toast.success('Theme deleted successfully!');
			} else {
				const error = await response.text();
				toast.error('Error deleting theme: ' + error);
			}
		} catch (error) {
			toast.error('Error deleting theme: ' + error);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Theme Management - UBSC Chapter</title>
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8">
	<div class="sm:flex sm:items-center">
		<div class="sm:flex-auto">
			<h1 class="text-2xl font-semibold leading-6 text-secondary">Theme Management</h1>
			<p class="mt-2 text-sm text-secondary/70">
				Manage website themes. Each admin can create one theme. Select a theme to make it active on
				the website.
			</p>
		</div>
		<div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
			{#if !data.userTheme}
				<button
					type="button"
					onclick={() => openEditModal()}
					class="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary"
				>
					Create My Theme
				</button>
			{/if}
		</div>
	</div>

	<!-- Themes Table -->
	<div class="mt-8 flow-root">
		<div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
			<div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
				<div
					class="overflow-clip border border-primary shadow ring-1 ring-primary ring-opacity-5 sm:rounded-lg"
				>
					<table class="min-w-full divide-y divide-secondary/20 overflow-clip">
						<thead class="bg-muted">
							<tr>
								<th
									scope="col"
									class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-secondary sm:pl-6"
									>Creator</th
								>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary"
									>Colors Preview</th
								>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary"
									>Status</th
								>
								<th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-secondary"
									>Updated</th
								>
								<th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
									<span class="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-primary/10 bg-background">
							{#if data.themes.length === 0}
								<tr>
									<td colspan="5" class="px-3 py-4 text-center text-sm text-secondary">
										No themes available. Create your first theme!
									</td>
								</tr>
							{:else}
								{#each data.themes as theme}
									<tr>
										<td
											class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-secondary sm:pl-6"
										>
											{theme.creatorFirstName}
											{theme.creatorLastName}
											<div class="text-primary">@{theme.creatorUsername}</div>
										</td>
										<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
											<div class="flex space-x-1">
												<div
													class="h-6 w-6 rounded border border-gray-300"
													style="background-color: {theme.primaryColor};"
													title="Primary"
												></div>
												<div
													class="h-6 w-6 rounded border border-gray-300"
													style="background-color: {theme.secondaryColor};"
													title="Secondary"
												></div>
												<div
													class="h-6 w-6 rounded border border-gray-300"
													style="background-color: {theme.accentColor};"
													title="Accent"
												></div>
												<div
													class="h-6 w-6 rounded border border-gray-300"
													style="background-color: {theme.buttonColor};"
													title="Button"
												></div>
											</div>
										</td>
										<td class="whitespace-nowrap px-3 py-4 text-sm text-muted">
											{#if theme.selected}
												<span
													class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800"
												>
													Selected
												</span>
											{:else}
												<span
													class="inline-flex rounded-full bg-muted px-2 text-xs font-semibold leading-5 text-secondary"
												>
													Not Selected
												</span>
											{/if}
										</td>
										<td class="whitespace-nowrap px-3 py-4 text-sm text-secondary">
											{new Date(theme.updatedAt).toLocaleDateString()}
										</td>
										<td
											class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
										>
											<div class="flex justify-end space-x-2">
												{#if !theme.selected}
													<button
														onclick={() => selectTheme(theme.id)}
														disabled={loading}
														class="text-sky-600 hover:text-primary disabled:opacity-50"
													>
														Select
													</button>
												{/if}
												{#if theme.createdBy === data.currentUserId}
													<button
														onclick={() => openEditModal(theme)}
														disabled={loading}
														class="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
													>
														Edit
													</button>
													<button
														onclick={() => deleteTheme(theme.id)}
														disabled={loading}
														class="text-red-600 hover:text-red-900 disabled:opacity-50"
													>
														Delete
													</button>
												{/if}
											</div>
										</td>
									</tr>
								{/each}
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Edit/Create Theme Modal -->
{#if showEditModal}
	<div
		class="fixed inset-0 z-50 overflow-y-auto"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
	>
		<div
			class="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
		>
			<!-- Background overlay -->
			<div
				class="fixed inset-0 bg-muted bg-opacity-75 transition-opacity"
				onclick={() => (showEditModal = false)}
			></div>

			<!-- Modal panel -->
			<div
				class="inline-block transform overflow-hidden rounded-lg bg-muted text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle"
			>
				<div class="bg-muted px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div class="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
							<h3 class="text-lg font-semibold leading-6 text-secondary" id="modal-title">
								{editingTheme ? 'Edit Your Theme' : 'Create Your Theme'}
							</h3>
							<div class="mt-6">
								<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
									{#each colorSections as section}
										<div class="rounded-lg border border-primary/50 p-4">
											<h4 class="mb-3 text-sm font-medium text-secondary">{section.title}</h4>
											<div class="space-y-3">
												{#each section.colors as color}
													<div class="flex items-center justify-between">
														<label for={color.key} class="text-sm text-secondary/70">
															{color.label}
														</label>
														<div class="flex items-center space-x-2">
															<div
																class="h-8 w-8 rounded border border-gray-300"
																style="background-color: {themeData[color.key]};"
															></div>
															<input
																type="color"
																id={color.key}
																bind:value={themeData[color.key]}
																class="h-8 w-12 rounded border-gray-300"
															/>
															<input
																type="text"
																bind:value={themeData[color.key]}
																class="w-20 rounded-md border-gray-300 text-xs"
															/>
														</div>
													</div>
												{/each}
											</div>
										</div>
									{/each}
								</div>

								<!-- Additional fields -->
								<div class="mt-6 space-y-4">
									<div>
										<label for="logoUrl" class="block text-sm font-medium text-secondary/70"
											>Logo URL</label
										>
										<input
											type="url"
											id="logoUrl"
											bind:value={themeData.logoUrl}
											placeholder="https://example.com/logo.png"
											class="mt-1 block w-full rounded-md border-muted shadow-sm focus:border-primary/80 focus:ring-primary sm:text-sm"
										/>
									</div>

									<div>
										<label for="faviconUrl" class="block text-sm font-medium text-secondary/70"
											>Favicon URL</label
										>
										<input
											type="url"
											id="faviconUrl"
											bind:value={themeData.faviconUrl}
											placeholder="https://example.com/favicon.ico"
											class="mt-1 block w-full rounded-md border-muted shadow-sm focus:border-primary/80 focus:ring-primary sm:text-sm"
										/>
									</div>

									<div>
										<label for="customCss" class="block text-sm font-medium text-secondary/70"
											>Custom CSS</label
										>
										<textarea
											id="customCss"
											bind:value={themeData.customCss}
											rows="4"
											class="mt-1 py-2 px-2 text-muted block w-full rounded-md border-muted font-mono text-xs shadow-sm focus:border-primary/80 focus:ring-primary sm:text-sm"
											placeholder="/* Add your custom CSS here */"
										></textarea>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-muted px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
					<button
						type="button"
						onclick={saveTheme}
						disabled={loading}
						class="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-background shadow-sm hover:bg-primary disabled:opacity-50 sm:ml-3 sm:w-auto"
					>
						{loading ? 'Saving...' : 'Save Theme'}
					</button>
					<button
						type="button"
						onclick={() => (showEditModal = false)}
						disabled={loading}
						class="mt-3 inline-flex w-full justify-center rounded-md bg-muted px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-inset ring-primary hover:bg-primary/10 disabled:opacity-50 sm:mt-0 sm:w-auto"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
