<script setup lang="ts">
    import ImageSkeleton from '@/components/ui/ImageSkeleton.vue';

    const props = defineProps({
        image: {
            type: String,
            default: '/images/default-publication-image.png',
        },
        imageAlt: {
            type: String,
            default: 'Publication image',
        },
        title: String,
        description: String,
        shelterName: String,
        shelterId: String,
        province: String,
    })
</script>

<template>
    <div class="w-[240px] h-[330px] rounded-md bg-white shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg">
        <ImageSkeleton :source="image" :alt="imageAlt" class="w-full h-[50%] max-h-[50%] object-cover" />
        <div class="flex flex-col box-border p-2 h-[50%]">
            <h1 class="font-semibold text-center transform-none color-[#595959] text-[16px] h-[15%] capitalize m-0">{{ title }}</h1>
            <div class="h-[40%]">
                <p class="leading-[1.2] text-[10pt] font-normal text-left box-border py-[10px] px-0 color-[#545454] max-h-[calc(14pt*4)] text-ellipsis line-clamp-4">{{ description }}</p>
            </div>
            <span class="flex grow flex-col"></span>
            <div class="flex flex-row h-auto items-end justify-between box-border">
                <h3 class="text-[10pt] font-extralight text-[#545454] max-w-[50%] whitespace-nowrap overflow-hidden text-ellipsis">{{ province }}</h3>
                <a class="text-[10pt] font-extralight text-primary" :href="'/perfil/' + shelterId">{{ shelterName }}</a>
            </div>
        </div>
    </div>
</template>