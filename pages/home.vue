<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'
    
    import NavBar from '@/components/ui/NavBar.vue'
    import PublicationGrid from '@/components/ui/PublicationGrid.vue'

    const config = useRuntimeConfig()

    const user = toRaw(useAuthStore().user)
    const logged: boolean = toRaw(user.logged)

    const page = ref(1)

    useHead({
        title: 'Inicio | DogsHome',
    })

    let userNames: any = null
    if (logged && user.name) {
        userNames = JSON.parse(user.name)
    }

    const sessionCookie = useCookie('session')

    useNuxtApp().hooks.hook('app:mounted', async () => {
        const { $auth } = useNuxtApp()
        $auth.currentUser?.reload()
        console.log("FIREBASE USER HAS BEEN RELOADED 01")

        console.log($auth.currentUser)

        if ($auth.currentUser) {
            const currentUser = $auth.currentUser
            useAuthStore().updateUser(currentUser.email!, currentUser.emailVerified, currentUser.displayName!, currentUser.photoURL!, currentUser.uid, true)
        }
    })

    const getPublications = async (page_number: number = 1) => {
        const response = await fetch(`${config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl}/publications/page/${page_number}`, {
            method: 'GET',
            credentials: 'include',
        })

        const response_json = await response.json()

        return response_json
    }

    const publications = ref<any[]>([])
    const loading = ref(true)
    const reachedEnd = ref(false)

    onMounted(async () => {
        await getAndAddPublications(page.value)
        page.value += 1

        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 660 && !loading.value && !reachedEnd.value) {
                getAndAddPublications(page.value)
                page.value += 1
            }
        })
    })

    const getAndAddPublications = async (page: number = 1) => {
        loading.value = true
        const newPublications = await getPublications(page)
        if (newPublications.length == 0) {
            reachedEnd.value = true
            loading.value = false
            return
        }
        publications.value = [...publications.value, ...newPublications]
        loading.value = false
    }



</script>

<template>
    <NavBar selected-dropdown-field="0"/>
    <!-- <h1>{{ logged && user.name ? `User is logged in as ${userNames.nameAndSurname.displayName} (${user.email})` : "User is anonymous" }}</h1> -->
    <div class="flex flex-col px-[15px] py-[25px] items-center justify-start">
        <PublicationGrid :publications="publications" :loading="loading" />
    </div>
</template>