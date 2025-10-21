<script lang="ts">
    import Header from './../lib/components/header.svelte';
    import ImageViewer from './../lib/components/image-viewer.svelte';
    import BottomControls from './../lib/components/bottom-controls.svelte';
    import SettingsDrawer from './../lib/components/settings-drawer.svelte';
    import PageSlider from './../lib/components/page-slider.svelte';
    import { isFullscreen } from './../lib/stores/manga-store';
    import { fade } from 'svelte/transition';
    
    let fullscreen = $derived($isFullscreen);
</script>

<div class="dark bg-background text-foreground min-h-screen flex flex-col font-['Manrope',sans-serif] overflow-hidden">
    {#if !fullscreen}
        <div transition:fade={{ duration: 200 }}>
            <Header />
        </div>
    {/if}

    <main class="flex-1 flex flex-col relative overflow-hidden">
        <div class="flex-1 relative">
            <ImageViewer />
            {#if !fullscreen}
                <div transition:fade={{ duration: 200 }}>
                    <PageSlider />
                </div>
            {/if}
        </div>
    </main>

    {#if !fullscreen}
        <div transition:fade={{ duration: 200 }}>
            <BottomControls />
        </div>
    {/if}
    
    <SettingsDrawer />
</div>
