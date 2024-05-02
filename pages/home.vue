<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'
    const user = toRaw(useAuthStore().user)
    const logged: boolean = toRaw(user.logged)

    useHead({
        title: 'Inicio | DogsHome',
    })

    let userNames: any = null
    if (logged && user.name) {
        userNames = JSON.parse(user.name)
    }

    const sessionCookie = useCookie('session')

</script>

<template>
    <NavBar />
    <!-- <h1>{{ logged && user.name ? `User is logged in as ${userNames.nameAndSurname.displayName} (${user.email})` : "User is anonymous" }}</h1> -->
</template>