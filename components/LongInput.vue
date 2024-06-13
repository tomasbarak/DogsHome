<script setup lang="ts">
    const props = defineProps({
        modelValue: String,
        placeholder: String,
        type: String,
        maxlength: String
    })

    const emit = defineEmits(['update:modelValue'])

    const handleInput = (event: any) => {
        emit('update:modelValue', event.target.value)
    }

    const inputElement = ref<HTMLInputElement>()

    onMounted( async () => {
        emit('update:modelValue', inputElement!.value?.value)
    })
    
</script>
<template>
    <textarea
        ref="inputElement"
        :value="modelValue"
        @input="handleInput"
        :type="type"
        :placeholder="placeholder"
        :maxlength="maxlength"
        class="resize-none max-w-[350px] w-[75vw] h-[150px] p-[5px] md:w-[50vw] input border-[#d3d3d3] border-1 rounded-[6px] focus:outline-none focus:border-[#079292] transition-colors text-left text-[10pt]"/>
</template>