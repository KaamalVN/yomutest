<script lang="ts">
	import { isFullscreen, preferences } from "../stores/manga-store";
	import { mangaActions } from "../stores/manga-store";
	import { languages } from "../utils/api";
	import { fade } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { Settings, Languages, Palette, Play, Check } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	let hidden = $derived($isFullscreen);
	let userPreferences = $derived($preferences);

	// Get language names for display
	let sourceLanguageName = $derived(languages.find((l) => l.code === userPreferences.sourceLanguage)?.name || "Auto");
	let targetLanguageName = $derived(languages.find((l) => l.code === userPreferences.targetLanguage)?.name || "EN");

	function toggleTranslation() {
		mangaActions.updatePreferences({
			translationEnabled: !userPreferences.translationEnabled,
		});
		toast.success(userPreferences.translationEnabled ? "Translation disabled" : "Translation enabled");
	}

	function toggleColorization() {
		mangaActions.updatePreferences({
			colorizationEnabled: !userPreferences.colorizationEnabled,
		});
		toast.success(userPreferences.colorizationEnabled ? "Colorization disabled" : "Colorization enabled");
	}

	async function initiateProcessing() {
		if (!userPreferences.translationEnabled && !userPreferences.colorizationEnabled) {
			toast.error("Please enable translation or colorization first");
			return;
		}

		toast.success("Processing initiated...");
		// Here you would send data to backend
		console.log("Initiating processing with preferences:", userPreferences);
	}
</script>

{#if !hidden}
	<div class="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 p-3 sm:p-4 shrink-0" transition:fade={{ duration: 200 }}>
		<div class="flex items-center justify-center max-w-4xl mx-auto gap-2 sm:gap-3">
			<!-- Settings Button -->
			<Button variant="outline" size="sm" onclick={() => mangaActions.toggleSettings()} class="flex items-center gap-2 px-3 py-2 h-auto text-xs sm:text-sm" aria-label="Open settings">
				<Settings class="size-4" />
				<span class="font-medium hidden sm:inline">Settings</span>
			</Button>

			<!-- Translation Button -->
			<Button variant={userPreferences.translationEnabled ? "default" : "outline"} size="sm" onclick={toggleTranslation} class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 h-auto min-w-0 flex-1 max-w-32 sm:max-w-40 text-xs sm:text-sm" aria-label="Toggle translation">
				{#if userPreferences.translationEnabled}
					<Check class="size-3 sm:size-4 shrink-0" />
				{:else}
					<Languages class="size-3 sm:size-4 shrink-0" />
				{/if}
				<div class="min-w-0 flex-1 text-left">
					<div class="font-medium text-xs sm:text-sm">Translate</div>
					{#if userPreferences.translationEnabled}
						<div class="text-xs opacity-80 truncate hidden sm:block">
							{sourceLanguageName} → {targetLanguageName}
						</div>
					{/if}
				</div>
			</Button>

			<!-- Colorization Button -->
			<Button variant={userPreferences.colorizationEnabled ? "default" : "outline"} size="sm" onclick={toggleColorization} class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 h-auto text-xs sm:text-sm" aria-label="Toggle colorization">
				{#if userPreferences.colorizationEnabled}
					<Check class="size-3 sm:size-4" />
				{:else}
					<Palette class="size-3 sm:size-4" />
				{/if}
				<span class="font-medium hidden sm:inline">Colorize</span>
			</Button>

			<!-- Initiate Button -->
			<Button size="sm" onclick={initiateProcessing} class="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 h-auto bg-primary hover:bg-primary/90 text-xs sm:text-sm" aria-label="Start processing">
				<Play class="size-3 sm:size-4" />
				<span class="font-medium">Initiate</span>
			</Button>
		</div>
	</div>
{/if}
