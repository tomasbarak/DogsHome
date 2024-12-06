<script setup lang="ts">
    import ImageSkeleton from '@/components/ui/ImageSkeleton.vue';

    const config = useRuntimeConfig()

    const props = defineProps<{
        image: {
            type: String
            default: '/images/default-publication-image.png',
        };
        imageAlt: {
            type: String,
            default: 'Publication image',
        };
        title: String;
        description: String;
        shelterName: String;
        shelterId: String;
        province: String;
        isDraft: {
            type: boolean,
            default: false,
        };
        publicationId: String;
    }>()

    const drafts = useState<any[]>('drafts', () => [])
    

    const handleDeleteDraft = async () => {
        const response = await fetch(`${config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl}/drafts/${props.publicationId}`, {
            method: 'DELETE',
            credentials: 'include',
        })

        if (response.status == 200) {
            drafts.value = drafts.value.filter((draft) => draft.publication_id != props.publicationId)
        }
    }
</script>

<template>
    <a :href="!isDraft ? `/publicacion/${publicationId}` : `/crear/borrador/${publicationId}` " target="_blank" class="relative w-[290px] h-[380px] sm:w-[240px] sm:h-[330px] rounded-md bg-white shadow-md overflow-hidden cursor-pointer transition-shadow hover:shadow-lg">
        <ImageSkeleton :source="image" :alt="imageAlt" class="w-full h-[50%] max-h-[50%] object-cover" />
        <a href="#" @click="handleDeleteDraft" v-if="isDraft" class="absolute m-0 p-0 flex items-center justify-center h-[50px] w-[50px] shadow-md rounded-full bg-white top-[calc(50%-65px)] left-[15px] border-none group hover:bg-error transition-colors">
            <Icon name="ic:round-delete" class="w-[24px] h-[24px] text-[#333] group-hover:text-white transition-colors"></Icon>
        </a>
        <a :href="`/crear/borrador/${publicationId}`" v-if="isDraft" class="absolute m-0 p-0 flex items-center justify-center h-[50px] w-[50px] shadow-md rounded-full bg-white top-[calc(50%-65px)] right-[15px] border-none group hover:bg-primary transition-colors">
            <Icon name="ic:round-edit" class="w-[24px] h-[24px] text-[#333] group-hover:text-white transition-colors"></Icon>
        </a>
        <div class="flex flex-col box-border p-2 h-[50%]">
            <h1 class="font-semibold text-center transform-none color-[#595959] text-[16px] h-[15%] capitalize m-0">{{ title }}</h1>
            <div class="h-[40%]">
                <p class="leading-[1.2] text-[10pt] font-normal text-left box-border py-[10px] px-0 color-[#545454] max-h-[calc(14pt*4)] text-ellipsis line-clamp-4">{{ description }}</p>
            </div>
            <span class="flex grow flex-col"></span>
            <div class="flex flex-row h-auto items-center justify-between box-border">
                <h3 v-if="!isDraft" class="text-[10pt] font-extralight text-[#545454] max-w-[50%] whitespace-nowrap overflow-hidden text-ellipsis">{{ province }}</h3>
                <span v-else></span>
                <a class="text-[10pt] font-extralight text-primary" :href="'/perfil/' + shelterId">{{ shelterName }}</a>
            </div>
        </div>
    </a>
</template>