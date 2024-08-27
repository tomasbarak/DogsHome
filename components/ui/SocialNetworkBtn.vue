<script setup lang="ts">
    const props = defineProps({
        username: String,
        baseUrl: String,
        iconName: String,
        iconColor: String,
    })

    const handleClick = (event: any) => {
        window.open(`${props.baseUrl}/${props.username}`, '_blank')
    }

</script>
<template>
    <button @click="handleClick">
        <Icon :color="iconColor" :name="iconName" class="w-[24px] h-[24px]"></Icon>
    </button>
</template>