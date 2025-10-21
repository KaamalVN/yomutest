<script lang="ts">
	import { currentPage, totalPages, isFullscreen } from "../stores/manga-store";
	import { mangaActions } from "../stores/manga-store";
	import { fade } from "svelte/transition";

	let hidden = $derived($isFullscreen);
	let currentPageValue = $derived($currentPage);
	let totalPagesValue = $derived($totalPages);

	function goToPage(page: number) {
		mangaActions.setCurrentPage(page);
	}
</script>

{#if !hidden && totalPagesValue > 0}
	<div class="absolute bottom-16 sm:bottom-20 left-4 right-4 z-40 flex justify-center" transition:fade={{ duration: 200 }}>
		<div class="bg-card/90 backdrop-blur-md border border-border/50 rounded-full px-4 py-2">
			<div class="flex items-center gap-3 text-sm">
				<span class="text-muted-foreground">Page</span>
				<span class="font-medium text-foreground">
					{currentPageValue} / {totalPagesValue}
				</span>
			</div>
		</div>
	</div>
{/if}
