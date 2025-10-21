import { writable, derived } from "svelte/store";
import type { AppState, MangaChapter, UserPreferences } from "../types/manga.js";

// Default preferences
const defaultPreferences: UserPreferences = {
	translationEnabled: false,
	colorizationEnabled: false,
	sourceLanguage: "ja",
	targetLanguage: "en",
	apiKey: "",
	modelSettings: {
		translationModel: "gpt-4",
		colorizationModel: "stable-diffusion",
		quality: "medium",
	},
};

// Default app state
const defaultState: AppState = {
	currentPage: 1,
	totalPages: 0,
	isFullscreen: false,
	isSettingsOpen: false,
	currentChapter: null,
	preferences: defaultPreferences,
};

// Main app state store
export const appState = writable<AppState>(defaultState);

// Derived stores for specific state slices
export const currentPage = derived(appState, ($state) => $state.currentPage);
export const totalPages = derived(appState, ($state) => $state.totalPages);
export const isFullscreen = derived(appState, ($state) => $state.isFullscreen);
export const isSettingsOpen = derived(appState, ($state) => $state.isSettingsOpen);
export const currentChapter = derived(appState, ($state) => $state.currentChapter);
export const preferences = derived(appState, ($state) => $state.preferences);

// Progress percentage
export const progress = derived([currentPage, totalPages], ([current, total]) => (total > 0 ? (current / total) * 100 : 0));

// Store actions
export const mangaActions = {
	setCurrentPage: (page: number) => {
		appState.update((state) => ({ ...state, currentPage: page }));
	},

	setChapter: (chapter: MangaChapter) => {
		appState.update((state) => ({
			...state,
			currentChapter: chapter,
			totalPages: chapter.pages.length,
			currentPage: 1,
		}));
	},

	toggleFullscreen: () => {
		appState.update((state) => {
			const newFullscreenState = !state.isFullscreen;
			
			// Handle browser fullscreen API
			if (typeof document !== 'undefined') {
				if (newFullscreenState) {
					// Enter fullscreen
					if (document.documentElement.requestFullscreen) {
						document.documentElement.requestFullscreen().catch(() => {
							// Fallback if fullscreen API fails
							console.log('Fullscreen API not available, using UI-only fullscreen');
						});
					}
				} else {
					// Exit fullscreen
					if (document.fullscreenElement && document.exitFullscreen) {
						document.exitFullscreen().catch(() => {
							// Fallback if exit fullscreen fails
							console.log('Exit fullscreen failed, using UI-only mode');
						});
					}
				}
			}
			
			return { ...state, isFullscreen: newFullscreenState };
		});
	},

	toggleSettings: () => {
		appState.update((state) => ({ ...state, isSettingsOpen: !state.isSettingsOpen }));
	},

	updatePreferences: (newPreferences: Partial<UserPreferences>) => {
		appState.update((state) => ({
			...state,
			preferences: { ...state.preferences, ...newPreferences },
		}));
	},

	nextPage: () => {
		appState.update((state) => ({
			...state,
			currentPage: Math.min(state.currentPage + 1, state.totalPages),
		}));
	},

	previousPage: () => {
		appState.update((state) => ({
			...state,
			currentPage: Math.max(state.currentPage - 1, 1),
		}));
	},

	setClipboardUrl: (url: string) => {
		appState.update((state) => ({
			...state,
			preferences: { ...state.preferences, clipboardUrl: url },
		}));
	},
};
