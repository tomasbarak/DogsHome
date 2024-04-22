<script setup lang="ts">
    const isAuth = useState('isAuth')
    const user = useState('user')
</script>

<template>
    <NavBar />
    <h1>{{ isAuth }}</h1>
</template>