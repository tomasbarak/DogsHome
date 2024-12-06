<script setup lang="ts">
    import PublicationCard from '@/components/ui/PublicationCard.vue';
    import LoadingAnimation from '@/components/ui/animations/LoadingAnimation.vue';

    // Define the interface for a publication
    interface Publication {
        publication_id: string;
        images: string[];
        title: string;
        description: string;
        publisher_name: string;
        location: {
            province_name: string;
        };
    }

    // Use the interface in the defineProps call
    const props = defineProps<{
        publications: Publication[];
        loading: {
            type: boolean;
            default: true;
        };
        isDraft: {
            type: boolean;
            default: false;
        }
    }>();

    // Create a reactive copy of props.publications
    const reactivePublications = ref(props.publications);

    // Watch for changes in props.publications and update reactivePublications
    watch(() => props.publications, (newPublications) => {
        console.log('Updating reactivePublications');
        reactivePublications.value = newPublications;
    });
    
</script>

<template>
    <section class="w-full h-full flex justify-center flex-wrap gap-[50px] sm:gap-[15px]">
        <PublicationCard :isDraft="isDraft" v-for="publication in reactivePublications"
            :key="publication.publication_id"
            :image="publication.images && publication.images.length > 0 ? publication.images[0] : null"
            :title="publication.title"
            :description="publication.description"
            :shelterName="publication.publisher_name"
            :province="publication.location ? publication.location.province_name : null"
            :publicationId="publication.publication_id"/>
    </section>
    <LoadingAnimation :class="{'visible': loading, 'hidden': !loading}" />
</template>