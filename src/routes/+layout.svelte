<script lang="ts">
    import '../app.css';
    import { Toaster } from "svelte-sonner";
    import { browser } from '$app/environment';
    import { onMount } from "svelte";

    onMount(() => {
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

        // Handle fullscreen change events to sync with store
        const handleFullscreenChange = () => {
            const isCurrentlyFullscreen = !!document.fullscreenElement;
            // Import and update store if needed
            import('../lib/stores/manga-store').then(({ appState }) => {
                appState.update(state => {
                    if (state.isFullscreen !== isCurrentlyFullscreen) {
                        return { ...state, isFullscreen: isCurrentlyFullscreen };
                    }
                    return state;
                });
            });
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    });
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#8b5cf6" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Yomu Reader" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/x-icon" href="/yomu.ico" />
    <link rel="apple-touch-icon" href="/yomu.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
    <title>Yomu Reader</title>
</svelte:head>

<Toaster />

<slot />




