<script lang="ts">
	import { preferences } from "../stores/manga-store";
	import { mangaActions } from "../stores/manga-store";
	import { mockApi, languages, models } from "../utils/api";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import { Select, SelectContent, SelectItem, SelectTrigger } from "$lib/components/ui/select";
	import { Separator } from "$lib/components/ui/separator";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Loader, ExternalLink, Save, Languages, Palette, Key, Cpu } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	let chapterUrl = $state("");
	let isLoading = $state(false);
	let loadError = $state("");

	let userPreferences = $derived($preferences);

	// Auto-populate URL from clipboard if available
	$effect(() => {
		if (userPreferences.clipboardUrl && !chapterUrl) {
			chapterUrl = userPreferences.clipboardUrl;
		}
	});

	async function loadChapter() {
		if (!chapterUrl.trim()) return;

		isLoading = true;
		loadError = "";

		try {
			const chapter = await mockApi.fetchChapter(chapterUrl);
			mangaActions.setChapter(chapter);
			toast.success("Chapter loaded successfully!");
		} catch (error) {
			loadError = error instanceof Error ? error.message : "Failed to load chapter";
			toast.error(loadError);
		} finally {
			isLoading = false;
		}
	}

	function updatePreference<K extends keyof typeof userPreferences>(key: K, value: (typeof userPreferences)[K]) {
		mangaActions.updatePreferences({ [key]: value });
	}

	function saveSettings() {
		toast.success("Settings saved!");
		mangaActions.toggleSettings();
	}
</script>

<div class="space-y-6 p-6 bg-background">
	<!-- Chapter URL Input -->
	<Card class="border-border/30 bg-card/50 backdrop-blur-sm">
		<CardHeader class="pb-4">
			<CardTitle class="flex items-center gap-3 text-lg text-card-foreground">
				<div class="p-2 bg-primary/20 rounded-xl border border-primary/30">
					<ExternalLink class="size-4 text-primary" />
				</div>
				Load Chapter
			</CardTitle>
			<CardDescription class="text-muted-foreground">Enter a manga chapter URL to start reading</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-3">
				<Label for="chapter-url" class="text-sm font-medium text-card-foreground">Chapter URL</Label>
				<Input id="chapter-url" type="url" placeholder="https://example.com/manga/chapter-1" bind:value={chapterUrl} disabled={isLoading} class="h-12 bg-background/50 border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground" />
			</div>

			{#if loadError}
				<div class="p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
					<p class="text-sm text-destructive font-medium">{loadError}</p>
				</div>
			{/if}

			<Button onclick={loadChapter} disabled={!chapterUrl.trim() || isLoading} class="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
				{#if isLoading}
					<Loader class="size-4 mr-2 animate-spin" />
					Loading Chapter...
				{:else}
					<ExternalLink class="size-4 mr-2" />
					Load Chapter
				{/if}
			</Button>
		</CardContent>
	</Card>

	<Separator class="bg-border/30" />

	<!-- Translation Settings -->
	<Card class="border-border/30 bg-card/50 backdrop-blur-sm">
		<CardHeader class="pb-4">
			<CardTitle class="flex items-center gap-3 text-lg text-card-foreground">
				<div class="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
					<Languages class="size-4 text-blue-400" />
				</div>
				Translation
			</CardTitle>
			<CardDescription class="text-muted-foreground">Automatically translate manga text using AI</CardDescription>
		</CardHeader>
		<CardContent class="space-y-5">
			<div class="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
				<div class="space-y-1">
					<Label for="translation-enabled" class="text-sm font-medium text-card-foreground">Enable Translation</Label>
					<p class="text-xs text-muted-foreground">Translate text bubbles in real-time</p>
				</div>
				<Switch id="translation-enabled" checked={userPreferences.translationEnabled} onCheckedChange={(checked) => updatePreference("translationEnabled", checked)} />
			</div>

			{#if userPreferences.translationEnabled}
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
					<div class="space-y-3">
						<Label class="text-sm font-medium text-card-foreground">Source Language</Label>
						<Select type="single" value={userPreferences.sourceLanguage} onValueChange={(value) => value && updatePreference("sourceLanguage", value)}>
							<SelectTrigger class="h-12 bg-background/50 border-border/50 text-foreground">
								{languages.find((l) => l.code === userPreferences.sourceLanguage)?.name || "Select"}
							</SelectTrigger>
							<SelectContent class="bg-card border-border/50">
								{#each languages as language}
									<SelectItem value={language.code} class="text-card-foreground hover:bg-accent/50">{language.name}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>

					<div class="space-y-3">
						<Label class="text-sm font-medium text-card-foreground">Target Language</Label>
						<Select type="single" value={userPreferences.targetLanguage} onValueChange={(value) => value && updatePreference("targetLanguage", value)}>
							<SelectTrigger class="h-12 bg-background/50 border-border/50 text-foreground">
								{languages.find((l) => l.code === userPreferences.targetLanguage)?.name || "Select"}
							</SelectTrigger>
							<SelectContent class="bg-card border-border/50">
								{#each languages as language}
									<SelectItem value={language.code} class="text-card-foreground hover:bg-accent/50">{language.name}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>
				</div>
			{/if}
		</CardContent>
	</Card>

	<!-- Colorization Settings -->
	<Card class="border-border/30 bg-card/50 backdrop-blur-sm">
		<CardHeader class="pb-4">
			<CardTitle class="flex items-center gap-3 text-lg text-card-foreground">
				<div class="p-2 bg-pink-500/20 rounded-xl border border-pink-500/30">
					<Palette class="size-4 text-pink-400" />
				</div>
				Colorization
			</CardTitle>
			<CardDescription class="text-muted-foreground">Add vibrant colors to black and white manga</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/30">
				<div class="space-y-1">
					<Label for="colorization-enabled" class="text-sm font-medium text-card-foreground">Enable Colorization</Label>
					<p class="text-xs text-muted-foreground">Transform grayscale pages into colorful artwork</p>
				</div>
				<Switch id="colorization-enabled" checked={userPreferences.colorizationEnabled} onCheckedChange={(checked) => updatePreference("colorizationEnabled", checked)} />
			</div>
		</CardContent>
	</Card>

	<Separator class="bg-border/30" />

	<!-- API Configuration -->
	<Card class="border-border/30 bg-card/50 backdrop-blur-sm">
		<CardHeader class="pb-4">
			<CardTitle class="flex items-center gap-3 text-lg text-card-foreground">
				<div class="p-2 bg-green-500/20 rounded-xl border border-green-500/30">
					<Key class="size-4 text-green-400" />
				</div>
				API Configuration
			</CardTitle>
			<CardDescription class="text-muted-foreground">Configure API keys and model settings for AI processing</CardDescription>
		</CardHeader>
		<CardContent class="space-y-5">
			<div class="space-y-3">
				<Label for="api-key" class="text-sm font-medium text-card-foreground">API Key</Label>
				<Input id="api-key" type="password" placeholder="Enter your OpenAI API key" value={userPreferences.apiKey} oninput={(e) => updatePreference("apiKey", e.currentTarget.value)} class="h-12 bg-background/50 border-border/50 focus:border-primary/50 text-foreground placeholder:text-muted-foreground" />
				<p class="text-xs text-muted-foreground">Your API key is stored locally and never shared</p>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="space-y-3">
					<Label class="text-sm font-medium text-card-foreground flex items-center gap-2">
						<Cpu class="size-3" />
						Translation Model
					</Label>
					<Select
						type="single"
						value={userPreferences.modelSettings.translationModel}
						onValueChange={(value) =>
							value &&
							updatePreference("modelSettings", {
								...userPreferences.modelSettings,
								translationModel: value,
							})}
					>
						<SelectTrigger class="h-12 bg-background/50 border-border/50 text-foreground">
							{models.translation.find((m) => m.value === userPreferences.modelSettings.translationModel)?.label || "Select"}
						</SelectTrigger>
						<SelectContent class="bg-card border-border/50">
							{#each models.translation as model}
								<SelectItem value={model.value} class="text-card-foreground hover:bg-accent/50">{model.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-3">
					<Label class="text-sm font-medium text-card-foreground flex items-center gap-2">
						<Palette class="size-3" />
						Colorization Model
					</Label>
					<Select
						type="single"
						value={userPreferences.modelSettings.colorizationModel}
						onValueChange={(value) =>
							value &&
							updatePreference("modelSettings", {
								...userPreferences.modelSettings,
								colorizationModel: value,
							})}
					>
						<SelectTrigger class="h-12 bg-background/50 border-border/50 text-foreground">
							{models.colorization.find((m) => m.value === userPreferences.modelSettings.colorizationModel)?.label || "Select"}
						</SelectTrigger>
						<SelectContent class="bg-card border-border/50">
							{#each models.colorization as model}
								<SelectItem value={model.value} class="text-card-foreground hover:bg-accent/50">{model.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div class="space-y-3">
				<Label class="text-sm font-medium text-card-foreground">Processing Quality</Label>
				<Select
					type="single"
					value={userPreferences.modelSettings.quality}
					onValueChange={(value) =>
						value &&
						updatePreference("modelSettings", {
							...userPreferences.modelSettings,
							quality: value as "low" | "medium" | "high",
						})}
				>
					<SelectTrigger class="h-12 bg-background/50 border-border/50 text-foreground">
						{userPreferences.modelSettings.quality.charAt(0).toUpperCase() + userPreferences.modelSettings.quality.slice(1)} Quality
					</SelectTrigger>
					<SelectContent class="bg-card border-border/50">
						<SelectItem value="low" class="text-card-foreground hover:bg-accent/50">Low Quality (Faster)</SelectItem>
						<SelectItem value="medium" class="text-card-foreground hover:bg-accent/50">Medium Quality (Balanced)</SelectItem>
						<SelectItem value="high" class="text-card-foreground hover:bg-accent/50">High Quality (Slower)</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</CardContent>
	</Card>

	<!-- Save Button -->
	<div class="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-background via-background/95 to-transparent">
		<Button onclick={saveSettings} class="w-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
			<Save class="size-5 mr-3" />
			Save Settings
		</Button>
	</div>
</div>
