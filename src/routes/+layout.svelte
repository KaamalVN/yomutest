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
    });
</script>

<svelte:head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <meta name="theme-color" content="#8b5cf6" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Yomu Reader" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/placeholder.svg?size=192x192&text=📚" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
    <title>Yomu Reader</title>
</svelte:head>

<Toaster />

<slot />




