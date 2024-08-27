<script setup lang="ts">

    onMounted( async () => {
        const animationElement = document.querySelector("#animationElement")

        const animation = useLottie(
            animationElement as HTMLElement,
            '/animations/dog-walking.json'
        )

        animation.init()
    })

</script>

<style scoped>
    .loading-hidden {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0.25s, opacity 0.5s linear;
    }

    .loading-shown {
        visibility: visible;
        opacity: 1;
        transition: visibility 0.25s, opacity 0.5s linear;
    }
</style>

<template>
    <div class="flex items-center justify-center w-full h-full bg-white">
        <span id="animationElement" class="w-[150px] h-[150px] md:w-[200px] md:h-[200px]"></span>
    </div>
</template>