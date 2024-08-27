<script setup lang="ts">
    onMounted( async () => {
        const dogWaitingAnimationEl = document.querySelector("#dogWaitingAnimation")

        const dogWaitingAnim = useLottie(
            dogWaitingAnimationEl as HTMLElement,
            '/animations/dog-waiting.json'
        )
        window.dgw = dogWaitingAnim
        dogWaitingAnim.init()
    })
</script>

<template>
    <span id="dogWaitingAnimation" class="w-[150px] h-[150px] md:w-[200px] md:h-[200px]"></span>
</template>