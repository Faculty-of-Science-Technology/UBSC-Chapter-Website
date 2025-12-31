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
	let savedRange: Range | null = null;
	let { oninput = () => {}, value = $bindable(), form = '', name = '' } = $props();
	function dispatchInputEvent(content: string) {
		value = content;
		editor.innerHTML = content;
		if (oninput) oninput(content);
	}
	function justSanitize(html: string) {
		const content = sanitizeHtml(html, {
			allowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'u', 'strike', 'ul', 'ol', 'li', 'br'],
			allowedAttributes: {
				'*': ['class', 'style']
			}
		});
		return content;
	}
	function sanitizeContent(event: Event) {
		const htmlContent = event.target.innerHTML;
		const content = sanitizeHtml(htmlContent, {
			allowedTags: [
				'p',
				'h1',
				'h2',
				'h3',
				'h4',
				'strong',
				'br',
				'b',
				'em',
				'u',
				'strike',
				'ul',
				'ol',
				'li'
			],
			allowedAttributes: {
				'*': ['class', 'style']
			}
		});
		dispatchInputEvent(content);
	}

	// Add selection saving and restoring functionality
	function saveSelection(): Range | null {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			return selection.getRangeAt(0).cloneRange();
		}
		return null;
	}

	function restoreSelection(range: Range): void {
		const selection = window.getSelection();
		if (selection) {
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}

	// Save selection when editor gets focus
	function handleFocus() {
		savedRange = saveSelection();
	}

	// Save selection when clicking inside the editor
	function handleClick() {
		savedRange = saveSelection();
	}

	// Save selection when there's any selection change
	function handleSelectionChange() {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0 && 
			editor && editor.contains(selection.anchorNode)) {
			savedRange = saveSelection();
		}
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

		// Handle markdown shortcuts
		if (event.key === 'Enter') {
			markdownBuffer = '';
			createList = true;
		} else if ((event.key === '#' || event.key === '-' || event.key === '*') && selection.isCollapsed) {
			markdownBuffer += event.key;
		} else if (event.key === ' ' && markdownBuffer && selection.isCollapsed) {
			event.preventDefault();
			const range = selection.getRangeAt(0);
			
			// Handle headings
			if (markdownBuffer.startsWith('#')) {
				const level = Math.min(markdownBuffer.length, 4);
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
				event.preventDefault();
				if (markdownBuffer === '-') {
					document.execCommand('insertUnorderedList', false);
				} else {
					// For * we'll use ordered lists
					document.execCommand('insertOrderedList', false);
				}
				
				// Apply proper styling to the list
				const selection = window.getSelection();
				if (selection) {
					let node = selection.anchorNode;
					let tagName = markdownBuffer === '-' ? 'UL' : 'OL';
					while (node && node.nodeName !== tagName) {
						node = node.parentNode;
					}
					if (node) {
						(node as HTMLElement).classList.add(
							'list-inside',
							tagName === 'UL' ? 'list-disc' : 'list-decimal'
						);
					}
				}
			}
			markdownBuffer = '';
			createList = false;
		} else if (event.key !== ' ') {
			markdownBuffer = '';
			createList = false;
		}
	}

	function format(command: string, imgString?: string) {
		// First ensure the editor has focus
		editor.focus();
		
		// Use the previously saved selection if we have one
		if (savedRange) {
			restoreSelection(savedRange);
		}
		
		// Apply the command
		document.execCommand(command, false, imgString);
		
		// Save the new selection after command
		savedRange = saveSelection();
		
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
		else if (command === 'justifyLeft' || command === 'justifyCenter' || command === 'justifyRight') {
			const selection = window.getSelection();
			if (selection) {
				const node = selection.anchorNode;
				if (node) {
					let element = node.nodeType === 3 ? node.parentNode : node;
					while (element && element.nodeName !== 'DIV' && element.nodeName !== 'P' && 
					       element.nodeName !== 'H1' && element.nodeName !== 'H2' && 
					       element.nodeName !== 'H3' && element.nodeName !== 'H4') {
						element = element.parentNode;
					}
					
					if (element) {
						const align = command === 'justifyLeft' ? 'left' : 
						             command === 'justifyCenter' ? 'center' : 'right';
						(element as HTMLElement).style.textAlign = align;
					}
				}
			}
		}
		else if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
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
		
		// Make sure we maintain focus after formatting
		editor.focus();
		
		// If we had a selection, restore it
		if (savedRange) {
			restoreSelection(savedRange);
		}
	}
</script>

<input type="hidden" {form} {name} bind:value />
<rt-editor-root
	class="relative max-h-[500px] w-full resize overflow-auto rounded-md border border-slate-300 pb-2"
>
	<div
		class="sticky top-0 z-10 flex w-full flex-wrap gap-2 rounded-md border border-slate-100 bg-background p-2"
	>
		<Button aria-label="Undo" onmousedown={(e) => { e.preventDefault(); format('undo'); }}>
			<Undo />
		</Button>
		<Button aria-label="Redo" onmousedown={(e) => { e.preventDefault(); format('redo'); }}>
			<Redo />
		</Button>
		<ToggleGroup.Root type="single">
			<ToggleGroup.Item value="heading" aria-label="heading" onmousedown={(e) => { e.preventDefault(); format('heading'); }}>
				<Heading />
			</ToggleGroup.Item></ToggleGroup.Root
		>
		<ToggleGroup.Root type="multiple">
			<ToggleGroup.Item value="bold" aria-label="Bold" onmousedown={(e) => { e.preventDefault(); format('bold'); }}>
				<Bold />
			</ToggleGroup.Item>
			<ToggleGroup.Item value="italic" aria-label="Italic" onmousedown={(e) => { e.preventDefault(); format('italic'); }}>
				<Italic />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="underline"
				aria-label="Underline"
				onmousedown={(e) => { e.preventDefault(); format('underline'); }}
			>
				<Underline />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="strikethrough"
				aria-label="Strikethrough"
				onmousedown={(e) => { e.preventDefault(); format('strikethrough'); }}
			>
				<Strikethrough />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<ToggleGroup.Root type="single">
			<ToggleGroup.Item
				value="justifyLeft"
				aria-label="Align Left"
				onmousedown={(e) => { e.preventDefault(); format('justifyLeft'); }}
			>
				<AlignLeft />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="justifyCenter"
				aria-label="Align Center"
				onmousedown={(e) => { e.preventDefault(); format('justifyCenter'); }}
			>
				<AlignCenter />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="justifyRight"
				aria-label="Align Right"
				onmousedown={(e) => { e.preventDefault(); format('justifyRight'); }}
			>
				<AlignRight />
			</ToggleGroup.Item>
		</ToggleGroup.Root>
		<ToggleGroup.Root type="single">
			<ToggleGroup.Item
				value="insertUnorderedList"
				aria-label="Bullet List"
				onmousedown={(e) => { e.preventDefault(); format('insertUnorderedList'); }}
			>
				<List />
			</ToggleGroup.Item>
			<ToggleGroup.Item
				value="insertOrderedList"
				aria-label="Numbered List"
				onmousedown={(e) => { e.preventDefault(); format('insertOrderedList'); }}
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
			onfocus={handleFocus}
			onclick={handleClick}
			onmouseup={handleSelectionChange}
			onkeyup={handleSelectionChange}
			role="textbox"
			tabindex="0"
		>
			{@html justSanitize(value)}
		</div>
	</div>
	<!-- <div class="sticky bottom-0 mx-2 bg-background py-2 text-sm font-light text-slate-600">
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
