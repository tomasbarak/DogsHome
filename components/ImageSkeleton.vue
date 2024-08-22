<script setup lang="ts">
    import { defineProps, ref, onMounted, watch } from 'vue'

    const props = defineProps({
        source: String,
        alt: String,
        errorSrc: {
            type: String,
            default: '/images/default-user-image.png',
        }
    })

    const skeletonDiv = ref<HTMLElement | null>(null)
    const img = ref<HTMLImageElement | null>(null)

    onMounted(() => {
        if (img.value) {
            //set the source to source
            img.value.src = props.source!

           

        }
    })

    const onImageLoaded = () => {
        if (skeletonDiv.value) {
            skeletonDiv.value.classList.add('hidden')
        }
    }

    const onImageError = () => {
        if (img.value) {
            img.value.src = props.errorSrc
        }
    }

    watch(() => props.source, (newSource) => {
        if (img.value) {

            if (skeletonDiv.value) {
                skeletonDiv.value.classList.remove('hidden')
            }

            img.value.src = newSource!

        }
    }, { immediate: true })

</script>

<template>
    <div class="w-full h-full">
        <div ref="skeletonDiv" class="flex bg-[#d3d3d3] skeleton w-full h-full"></div>
        <img ref="img" class="w-full h-full object-cover" :alt="alt" @load="onImageLoaded" @error="onImageError">
    </div>
</template>

<style scoped>

</style>