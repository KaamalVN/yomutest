<script lang="ts">
	import { currentChapter, currentPage, isFullscreen } from "../stores/manga-store.js";
	import { mangaActions } from "../stores/manga-store.js";
	import { fade } from "svelte/transition";
	import { onMount } from "svelte";
	import { BookOpen } from "lucide-svelte";

	let viewerContainer: HTMLDivElement;
	let imageElements: HTMLImageElement[] = [];

	let chapter = $derived($currentChapter);
	let pages = $derived(chapter?.pages || []);
	let currentPageNum = $derived($currentPage);

	// Handle image click for fullscreen toggle
	function handleImageClick() {
		mangaActions.toggleFullscreen();
	}

	// Handle keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case "ArrowRight":
			case "ArrowDown":
			case " ":
				event.preventDefault();
				mangaActions.nextPage();
				break;
			case "ArrowLeft":
			case "ArrowUp":
				event.preventDefault();
				mangaActions.previousPage();
				break;
			case "Escape":
				if ($isFullscreen) {
					mangaActions.toggleFullscreen();
				}
				break;
		}
	}

	// Scroll to current page
	function scrollToCurrentPage() {
		if (imageElements[currentPageNum - 1]) {
			imageElements[currentPageNum - 1].scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}

	// Update current page based on scroll position
	function handleScroll() {
		if (!viewerContainer || imageElements.length === 0) return;

		const containerRect = viewerContainer.getBoundingClientRect();
		const containerCenter = containerRect.top + containerRect.height / 2;

		let closestPage = 1;
		let closestDistance = Infinity;

		imageElements.forEach((img, index) => {
			const imgRect = img.getBoundingClientRect();
			const imgCenter = imgRect.top + imgRect.height / 2;
			const distance = Math.abs(imgCenter - containerCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestPage = index + 1;
			}
		});

		if (closestPage !== currentPageNum) {
			mangaActions.setCurrentPage(closestPage);
		}
	}

	onMount(() => {
		// Add keyboard event listener
		window.addEventListener("keydown", handleKeydown);

		return () => {
			window.removeEventListener("keydown", handleKeydown);
		};
	});

	$effect(() => {
		if (currentPageNum && imageElements.length > 0) {
			scrollToCurrentPage();
		}
	});
</script>

<div bind:this={viewerContainer} class="absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth bg-background" onscroll={handleScroll} role="main" aria-label="Manga viewer">
	{#if pages.length > 0}
		<div class="flex flex-col items-center gap-3 p-4 pb-24 max-w-4xl mx-auto min-h-full">
			{#each pages as page, index (page.id)}
				<div class="relative w-full max-w-2xl" transition:fade={{ duration: 300, delay: index * 50 }}>
					<img bind:this={imageElements[index]} src={page.imageUrl} alt="Manga page {page.pageNumber}" class="w-full h-auto rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200 select-none" loading="lazy" onclick={handleImageClick} onkeydown={(e) => e.key === "Enter" && handleImageClick()} tabindex="0" role="button" aria-label="Page {page.pageNumber}, click to toggle fullscreen" draggable="false" />

					<!-- Page number overlay -->
					<div class="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
						{page.pageNumber}
					</div>

					<!-- Translation/Colorization indicators -->
					{#if page.isTranslated || page.isColorized}
						<div class="absolute top-3 left-3 flex gap-2">
							{#if page.isTranslated}
								<span class="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">Translated</span>
							{/if}
							{#if page.isColorized}
								<span class="bg-accent/90 text-accent-foreground text-xs px-2 py-1 rounded-md font-medium">Colorized</span>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex items-center justify-center min-h-full p-8">
			<div class="text-center max-w-md mx-auto">
				<div class="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
					<BookOpen class="size-12 text-primary" />
				</div>
				<h2 class="text-xl font-semibold text-foreground mb-3">Welcome to Yomu Reader</h2>
				<p class="text-muted-foreground leading-relaxed">Enter a manga chapter URL in the settings to get started reading.</p>
			</div>
		</div>
	{/if}
</div>
