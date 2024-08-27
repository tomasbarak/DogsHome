<script setup lang="ts">
    const props = defineProps({
        modelValue: String,
        placeholder: String,
        type: String,
        socialNetworkBaseURL: String
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

    <div class="flex justify-start items-center max-w-[350px] w-[75vw] md:w-[50vw] h-[50px] border-b-[#d3d3d3] border-b-[1px] rounded-none focus-within:border-b-[#079292] transition-colors">
        <span class="m-0 p-0 h-fit whitespace-nowrap text-left text-[10pt] font-extrabold select-none" onclick="this.nextSibling.focus()">{{ socialNetworkBaseURL }}/</span>        
        <input ref="inputElement" maxlength="128" :value="modelValue" @input="handleInput" :type="type" :placeholder="placeholder" 
            class="input w-full h-full bg-transparent border-transparent focus:outline-none p-0 text-left text-[10pt]"/>
    </div>

    
</template>