<script  setup lang="ts">
    import PublicationGrid from '@/components/ui/PublicationGrid.vue';
    import NavBar from '@/components/ui/NavBar.vue';

    const borradores = [
        {
            "description": "Juan es un perro mediano/chico y de color marrón. Se comporta bien y sabe hacer pis afuera. Es juguetón.",
            "images": [
                "https://www.pawschicago.org/fileadmin/media/images/adoption_section/Grubman_PAWS_4673_01.jpg"
            ],
            "publication_id": "19158d36-4387-4cec-9e45-c24fd3bc92cd",
            "publisher_id": "lxfAgybtGDNpSINDa7b59uWJKmz2",
            "publisher_name": "dogshome",
            "title": "juan",
            "draft_status": 7,
            "location": {
                "province": "02",
                "province_name": "Ciudad Autónoma de Buenos Aires",
                "locality": "0208401003",
                "locality_name": "Villa Pueyrredón"
            }
        },
        {
            "description": "Juan es un perro mediano/chico y de color marrón. Se comporta bien y sabe hacer pis afuera. Es juguetón.",
            "images": [
                "https://www.pawschicago.org/fileadmin/media/images/adoption_section/Grubman_PAWS_4673_01.jpg"
            ],
            "publication_id": "19158d36-4387-4cec-9e45-c24fd3bc92cd",
            "publisher_id": "lxfAgybtGDNpSINDa7b59uWJKmz2",
            "publisher_name": "dogshome",
            "title": "juan",
            "draft_status": 7,
            "location": {
                "province": "02",
                "province_name": "Ciudad Autónoma de Buenos Aires",
                "locality": "0208401003",
                "locality_name": "Villa Pueyrredón"
            }
        }
    ]

</script>

<template>
    <NavBar />
    <section class="p-[32px]">
        <h1 class="text-[#333] font-extrabold text-[48px]">Borradores pendientes</h1>
        <PublicationGrid :publications="borradores" />
    </section>
</template>