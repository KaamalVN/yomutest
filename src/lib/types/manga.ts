export interface MangaChapter {
	id: string;
	title: string;
	chapterNumber: number;
	pages: MangaPage[];
	url: string;
}

export interface MangaPage {
	id: string;
	imageUrl: string;
	pageNumber: number;
	isTranslated?: boolean;
	isColorized?: boolean;
}

export interface UserPreferences {
	translationEnabled: boolean;
	colorizationEnabled: boolean;
	sourceLanguage: string;
	targetLanguage: string;
	apiKey: string;
	modelSettings: ModelSettings;
}

export interface ModelSettings {
	translationModel: string;
	colorizationModel: string;
	quality: "low" | "medium" | "high";
}

export interface AppState {
	currentPage: number;
	totalPages: number;
	isFullscreen: boolean;
	isSettingsOpen: boolean;
	currentChapter: MangaChapter | null;
	preferences: UserPreferences;
}

export interface Language {
	code: string;
	name: string;
}
