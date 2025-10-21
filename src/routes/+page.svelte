<script lang="ts">
    import { browser } from '$app/environment';
    import Header from './../lib/components/header.svelte';
    import ImageViewer from './../lib/components/image-viewer.svelte';
    import BottomControls from './../lib/components/bottom-controls.svelte';
    import SettingsDrawer from './../lib/components/settings-drawer.svelte';
    import PageSlider from './../lib/components/page-slider.svelte';
    import { isFullscreen } from './../lib/stores/manga-store.js';
    
    let fullscreen = $derived($isFullscreen);
</script>

{#if browser}
    <div class="dark bg-background text-foreground min-h-screen flex flex-col font-['Manrope',sans-serif] overflow-hidden">
        <Header />

        <main class="flex-1 flex flex-col relative overflow-hidden">
            <div class="flex-1 relative">
                <ImageViewer />
                <PageSlider />
            </div>
        </main>

        <BottomControls />
        <SettingsDrawer />
    </div>
{/if}
