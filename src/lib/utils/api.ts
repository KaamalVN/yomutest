import type { MangaChapter, MangaPage } from "../types/manga.js";

// Mock API functions - replace with real API calls
export const mockApi = {
	// Fetch manga chapter from URL
	async fetchChapter(url: string): Promise<MangaChapter> {
		// Simulate API delay
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Mock chapter data
		const mockPages: MangaPage[] = Array.from({ length: 20 }, (_, i) => ({
			id: `page-${i + 1}`,
			imageUrl: `/placeholder.svg?size=wide&text=Page ${i + 1}`,
			pageNumber: i + 1,
			isTranslated: false,
			isColorized: false,
		}));

		return {
			id: "chapter-1",
			title: "Sample Manga Chapter",
			chapterNumber: 1,
			pages: mockPages,
			url,
		};
	},

	// Translate manga page
	async translatePage(pageId: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return `/placeholder.svg?size=wide&text=Translated Page`;
	},

	// Colorize manga page
	async colorizePage(pageId: string, quality: string): Promise<string> {
		await new Promise((resolve) => setTimeout(resolve, 3000));
		return `/placeholder.svg?size=wide&text=Colorized Page`;
	},

	// Validate API key
	async validateApiKey(apiKey: string): Promise<boolean> {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return apiKey.length > 10; // Mock validation
	},
};

// Language options
export const languages = [
	{ code: "en", name: "English" },
	{ code: "ja", name: "Japanese" },
	{ code: "ko", name: "Korean" },
	{ code: "zh", name: "Chinese" },
	{ code: "es", name: "Spanish" },
	{ code: "fr", name: "French" },
	{ code: "de", name: "German" },
	{ code: "pt", name: "Portuguese" },
];

// Model options
export const models = {
	translation: [
		{ value: "gpt-4", label: "GPT-4" },
		{ value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
		{ value: "claude-3", label: "Claude 3" },
	],
	colorization: [
		{ value: "stable-diffusion", label: "Stable Diffusion" },
		{ value: "midjourney", label: "Midjourney" },
		{ value: "dall-e-3", label: "DALL-E 3" },
	],
};
