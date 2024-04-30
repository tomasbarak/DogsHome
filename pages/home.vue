<script setup lang="ts">
    const isAuth = useState('isAuth')
    const user = useState('user')

    useHead({
        title: 'Inicio | DogsHome',
    })
</script>

<template>
    <NavBar />
    <h1>{{ isAuth }}</h1>
</template>