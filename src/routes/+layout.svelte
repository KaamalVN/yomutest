<script lang="ts">
    import Header from './../lib/components/header.svelte';
    import { onMount } from "svelte";
    import ImageViewer from './../lib/components/image-viewer.svelte';
    import BottomControls from './../lib/components/bottom-controls.svelte';
    import SettingsDrawer from './../lib/components/settings-drawer.svelte';
    import PageSlider from './../lib/components/page-slider.svelte';
    import { isFullscreen } from './../lib/stores/manga-store.js';
    import { Toaster } from "svelte-sonner";
    
    let mounted = $state(false);

    onMount(() => {
        mounted = true;

        // Register service worker for PWA
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("SW registered: ", registration);
                })
                .catch((registrationError) => {
                    console.log("SW registration failed: ", registrationError);
                });
        }
    });

    let fullscreen = $derived($isFullscreen);
</script>

<svelte:head>
    <!-- PWA Meta Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#8b5cf6" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Yomu Reader" />

    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json" />

    <!-- Apple Touch Icons -->
    <link rel="apple-touch-icon" href="/placeholder.svg?size=192x192&text=📚" />

    <!-- Preload Manrope Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />

    <title>Yomu Reader</title>
</svelte:head>

<div class="dark bg-background text-foreground min-h-screen flex flex-col font-['Manrope',sans-serif] overflow-hidden">
    {#if mounted}
        <!-- Header - Fixed at top -->
        <Header />

        <!-- Main Content Area - Flexible height -->
        <main class="flex-1 flex flex-col relative overflow-hidden">
            <!-- Manga Viewer - Scrollable content -->
            <div class="flex-1 relative">
                <ImageViewer />

                <!-- Page Slider - Positioned over content -->
                <PageSlider />
            </div>
        </main>

        <!-- Bottom Controls - Fixed at bottom -->
        <BottomControls />

        <!-- Settings Drawer (mobile) -->
        <SettingsDrawer />

        <!-- Toast notifications -->
        <Toaster />
    {/if}
    
    <!-- This renders child pages/routes -->
    <slot />
</div>

<style>
	/* Import Manrope font */
	@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap");

	/* Global styles */
	:global(html, body) {
		height: 100%;
		overflow: hidden;
		font-family: "Manrope", sans-serif;
		scroll-behavior: smooth;
	}

	/* Custom scrollbar for webkit browsers */
	:global(.overflow-y-auto::-webkit-scrollbar) {
		width: 6px;
	}

	:global(.overflow-y-auto::-webkit-scrollbar-track) {
		background: hsl(var(--muted));
	}

	:global(.overflow-y-auto::-webkit-scrollbar-thumb) {
		background: hsl(var(--muted-foreground) / 0.3);
		border-radius: 3px;
	}

	:global(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
		background: hsl(var(--muted-foreground) / 0.5);
	}

	/* Focus styles for accessibility */
	:global(*:focus-visible) {
		outline: 2px solid hsl(var(--primary));
		outline-offset: 2px;
	}

	/* Prevent horizontal scrolling */
	:global(body) {
		overflow-x: hidden;
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		:global(body) {
			-webkit-overflow-scrolling: touch;
		}
	}
</style>
