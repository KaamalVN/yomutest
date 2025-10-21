<script lang="ts">
	import { currentChapter, isFullscreen } from "../stores/manga-store";
	import { mangaActions } from "../stores/manga-store";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { BookOpen, Clipboard } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	let chapter = $derived($currentChapter);
	let hidden = $derived($isFullscreen);

	// Auto-fetch URL from clipboard on mount
	onMount(async () => {
		try {
			if (navigator.clipboard && navigator.clipboard.readText) {
				const clipboardText = await navigator.clipboard.readText();
				if (clipboardText && (clipboardText.startsWith("http://") || clipboardText.startsWith("https://"))) {
					// Auto-set the URL if it looks like a valid URL
					mangaActions.setClipboardUrl(clipboardText);
					toast.success("URL detected from clipboard!");
				}
			}
		} catch (error) {
			// Clipboard access might be denied, that's okay
			console.log("Clipboard access not available");
		}
	});
</script>

{#if !hidden}
	<header class="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50 px-4 sm:px-6 py-3 sm:py-4 shrink-0" transition:fade={{ duration: 200 }}>
		<div class="flex items-center justify-between max-w-7xl mx-auto">
			<!-- Title and Chapter Info -->
			<div class="flex items-center gap-4 min-w-0 flex-1">
				<div class="p-2 bg-primary/10 rounded-lg">
					<BookOpen class="size-5 text-primary" />
				</div>
				<div class="min-w-0 flex-1">
					{#if chapter}
						<h1 class="font-semibold text-foreground truncate text-lg">
							{chapter.title}
						</h1>
						<div class="flex items-center gap-2 text-xs text-muted-foreground mt-1">
							<span>Chapter {chapter.chapterNumber}</span>
							<span>•</span>
							<span class="truncate max-w-48">{chapter.url}</span>
						</div>
					{:else}
						<h1 class="font-semibold text-foreground text-lg">Manga Reader</h1>
						<p class="text-xs text-muted-foreground mt-1">Load a chapter to start reading</p>
					{/if}
				</div>
			</div>

			<!-- Clipboard indicator -->
			<div class="hidden sm:flex items-center gap-2">
				<Clipboard class="size-4 text-muted-foreground" />
				<span class="text-xs text-muted-foreground">Auto-detect</span>
			</div>
		</div>
	</header>
{/if}
