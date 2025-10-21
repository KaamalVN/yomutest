<script lang="ts">
	import { isSettingsOpen } from "../stores/manga-store.js";
	import { mangaActions } from "../stores/manga-store.js";
	import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "$lib/components/ui/drawer";
	import { Button } from "$lib/components/ui/button";
	import { X, Settings, Sparkles } from "lucide-svelte";
	import SettingsPanel from "./settings-panel.svelte";

	let open = $derived($isSettingsOpen);

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			mangaActions.toggleSettings();
		}
	}
</script>

<Drawer {open} onOpenChange={handleOpenChange}>
	<DrawerContent class="max-h-[90vh] bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl">
		<DrawerHeader class="flex items-center justify-between border-b border-border/30 pb-6 px-6 bg-card/30">
			<div class="flex items-center gap-4">
				<div class="p-3 bg-primary/20 rounded-2xl border border-primary/30 shadow-lg">
					<Settings class="size-5 text-primary" />
				</div>
				<div>
					<DrawerTitle class="text-2xl font-bold text-foreground flex items-center gap-2">
						Settings
						<Sparkles class="size-4 text-primary" />
					</DrawerTitle>
					<DrawerDescription class="text-muted-foreground mt-1">Configure your Yomu Reader experience</DrawerDescription>
				</div>
			</div>
			<Button variant="ghost" size="sm" onclick={() => mangaActions.toggleSettings()} aria-label="Close settings" class="shrink-0 hover:bg-accent/50 rounded-xl p-2">
				<X class="size-5" />
			</Button>
		</DrawerHeader>

		<div class="overflow-y-auto flex-1 bg-background/50">
			<SettingsPanel />
		</div>
	</DrawerContent>
</Drawer>
