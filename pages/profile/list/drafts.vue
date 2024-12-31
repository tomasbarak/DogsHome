<script  setup lang="ts">
    import PublicationGrid from '@/components/ui/PublicationGrid.vue';
    import NavBar from '@/components/ui/NavBar.vue';

    const config = useRuntimeConfig()
    const page = ref(1)
 
    const getDrafts = async (page_number: number = 1) => {
        const response = await fetch(`${config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl}/drafts/page/${page_number}`, {
            method: 'GET',
            credentials: 'include',
        })

        const response_json = await response.json()

        return response_json
    }

    const drafts = useState<any[]>('drafts', () => [])
    const loading = ref(true)
    const reachedEnd = ref(false)

    onNuxtReady(async () => {
        await getAndAddDrafts(page.value)
        page.value += 1
    })

    onMounted(() => {
        window.addEventListener('scroll', async () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 660 && !loading.value && !reachedEnd.value) {
                await getAndAddDrafts(page.value)
                page.value += 1
            }
        })
    })

    const getAndAddDrafts = async (page: number = 1) => {
        loading.value = true
        const newPublications = await getDrafts(page)
        if (newPublications.length == 0) {
            reachedEnd.value = true
            loading.value = false
            return
        }
        drafts.value = [...drafts.value, ...newPublications]
        loading.value = false
    }
    
    
</script>

<template>
    <NavBar  selected-dropdown-field="3"/>
    <section class="p-[32px]">
        <h1 class="text-[#333] text-center font-extrabold text-[32px] md:text-[48px]">Borradores pendientes</h1>
        <div class="box-border py-[32px]">
            <PublicationGrid :is-draft="true" :publications="drafts" :loading="loading"/>
        </div>
    </section>
</template>