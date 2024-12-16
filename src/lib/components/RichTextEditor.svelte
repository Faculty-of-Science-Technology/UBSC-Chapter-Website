<script lang="ts">
	import { Button } from '$lib/components/vendor/ui/button';
	import * as ToggleGroup from '$lib/components/vendor/ui/toggle-group';
	import {
		AlignCenter,
		AlignLeft,
		AlignRight,
		Heading,
		List,
		ListOrdered,
		Redo,
		Strikethrough,
		Undo
	} from 'lucide-svelte';
	import Bold from 'lucide-svelte/icons/bold';
	import Italic from 'lucide-svelte/icons/italic';
	import Underline from 'lucide-svelte/icons/underline';
	import sanitizeHtml from 'sanitize-html';

	let markdownBuffer = '';
	let createList = false;
	let editor: HTMLDivElement;
	let { oninput = () => {}, value = $bindable(), form = '', name = '' } = $props();
	function dispatchInputEvent(content: string) {
		value = content;
		editor.innerHTML = content;
		if (oninput) oninput(content);
	}
	function justSanitize(html: string) {
		const content = sanitizeHtml(html, {
			allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 'strike', 'ul', 'ol', 'li'],
			allowedAttributes: {
				'*': ['class']
			}
		});
		return content;
	}
	function sanitizeContent(event: Event) {
		const htmlContent = event.target.innerHTML;
		const content = sanitizeHtml(htmlContent, {
			allowedTags: ['p', 'h1', 'h2', 'br', 'h3', 'h4', 'strong', 'em', 'u', 'strike', 'ul', 'ol', 'li'],
			allowedAttributes: {
				'*': ['class']
			}
		});
		dispatchInputEvent(content);
	}
	function handleKeydown(event: KeyboardEvent) {
		const selection = window.getSelection();
		if (!selection) return;

		if (event.key === 'Tab') {
			event.preventDefault();
			const range = selection.getRangeAt(0);
			const tabNode = document.createTextNode('\t');
			range.insertNode(tabNode);
			range.setStartAfter(tabNode);
			range.setEndAfter(tabNode);
			return;
		}

		// Start collecting markdown symbols
		if (event.key === 'Enter') {
			markdownBuffer = '';
			// const range = selection.getRangeAt(0);
			// const br = document.createElement('br');
			// range.insertNode(br);
			// range.setStartAfter(br);
			// range.setEndAfter(br);
			createList = true;
		} else if (event.key === '#' || event.key === '-' || event.key === '*') {
			markdownBuffer += event.key;
		} else if (event.key === ' ' && markdownBuffer) {
			event.preventDefault();
			const range = selection.getRangeAt(0);
			const currentLine = range.startContainer.textContent || '';

			// Handle headings
			if (markdownBuffer.startsWith('#')) {
				// We start by removing the markdown symbol

				const level = Math.min(markdownBuffer.length, 4);
				// const heading = currentLine.replace(markdownBuffer, '');
				range.setStart(range.startContainer, 0);
				range.deleteContents();
				document.execCommand('formatBlock', false, `h${level}`);
				const selection = window.getSelection();
				if (selection) {
					const node = selection.anchorNode;
					if (node && node.nodeType === 3) {
						const parent = node.parentNode;
						if (parent && parent.nodeName === `H${level}`) {
							const sizes = ['text-4xl', 'text-3xl', 'text-2xl', 'text-xl'];
							(parent as HTMLElement).classList.add(
								sizes[level - 1],
								'font-semibold',
								'leading-7',
								'tracking-tight'
							);
						}
					}
				}
			}
			// Handle lists
			else if ((markdownBuffer === '-' || markdownBuffer === '*') && createList) {
				const ul = document.createElement('ul');
				ul.className = 'list-inside list-disc';
				const li = document.createElement('li');
				ul.appendChild(li);
				range.setStart(range.startContainer, 0);
				range.deleteContents();
				range.insertNode(ul);
				li.focus();
			}
			markdownBuffer = '';
			createList = false;
		} else {
			markdownBuffer = '';
			createList = false;
		}
	}

	function format(command: string, imgString?: string) {
		document.execCommand(command, false, imgString);
		if (command === 'heading') {
			document.execCommand('formatBlock', false, 'h2');
			const selection = window.getSelection();
			if (selection) {
				const node = selection.anchorNode;
				if (node && node.nodeType === 3) {
					const parent = node.parentNode;
					if (parent && parent.nodeName === 'H2') {
						(parent as HTMLElement).classList.add(
							'text-3xl',
							'font-semibold',
							'leading-none',
							'tracking-tight'
						);
					}
				}
			}
		}
		if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
			// Hot-patch the execCommand to add classes to the stuff
			const selection = window.getSelection();
			if (selection) {
				let node = selection.anchorNode;
				const tagName = command === 'insertUnorderedList' ? 'UL' : 'OL';
				while (node && node.nodeName !== tagName) {
					node = node.parentNode;
				}
				if (node && node.nodeName === tagName) {
					(node as HTMLElement).classList.add(
						'list-inside',
						tagName === 'UL' ? 'list-disc' : 'list-decimal'
					);
				}
			}
		}
	}
</script>

<input type="hidden" {form} {name} bind:value />
<rt-editor-root
	class="relative max-h-[500px] w-full resize overflow-auto rounded-md border border-slate-300 pb-2"
>
	<div
		class="sticky top-0 z-10 flex w-full flex-wrap gap-2 rounded-md border border-slate-100 bg-white p-2"
	>
		<Button aria-label="Undo" onclick={() => format('undo')}>
			<Undo />
		</Button>
		<Button aria-label="Redo" onclick={() => format('redo')}>
			<Redo />
		</Button>
		<ToggleGroup.Root type="single">
			<ToggleGroup.Item value="heading" aria-label="heading" onclick={() => format('heading')}>
				<Heading />
			</ToggleGroup.Item></ToggleGroup.Root
		>
		<ToggleGroup.Root type="multiple">
			<ToggleGroup.Item value="bold" aria-label="Bold" onclick={() => format('bold')}>
				<Bold />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Italic" onclick={() => format('italic')}>
				<Italic />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="underline"
				aria-label="Underline"
				onclick={() => format('underline')}
			>
				<Underline />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="strikethrough"
				aria-label="Strikethrough"
				onclick={() => format('strikethrough')}
			>
				<Strikethrough />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<ToggleGroup.Root type="single">
			<ToggleGroup.Item
				value="justifyLeft"
				aria-label="Align Left"
				onclick={() => format('justifyLeft')}
			>
				<AlignLeft />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="justifyCenter"
				aria-label="Align Center"
				onclick={() => format('justifyCenter')}
			>
				<AlignCenter />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="justifyRight"
				aria-label="Align Right"
				onclick={() => format('justifyRight')}
			>
				<AlignRight />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<ToggleGroup.Root type="single">
			<ToggleGroup.Item
				value="insertUnorderedList"
				aria-label="Bullet List"
				onclick={() => format('insertUnorderedList')}
			>
				<List />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="insertOrderedList"
				aria-label="Numbered List"
				onclick={() => format('insertOrderedList')}
			>
				<ListOrdered />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
	</div>
	<div class="relative mx-3 mt-4 h-full min-h-[150px] pb-10">
		<div
			bind:this={editor}
			class="contenteditable h-full min-h-60 focus:outline-none"
			contenteditable="true"
			data-placeholder="Start typing here..."
			onkeydown={handleKeydown}
			onblur={sanitizeContent}
			role="textbox"
			tabindex="0"
		>
			{@html justSanitize(value)}
		</div>
	</div>
	<!-- <div class="sticky bottom-0 mx-2 bg-white py-2 text-sm font-light text-slate-600">
		<p>Note: Type "# " below any text to make it a heading.</p>
	</div> -->
</rt-editor-root>

<style>
	.contenteditable:empty::before {
		content: attr(data-placeholder);
		color: #a0aec0; /* Light placeholder text color */
		pointer-events: none;
	}
</style>
