<script setup lang="ts">
    import LoadingAnimation from '@/components/ui/animations/LoadingAnimation.vue';
    import Step01 from '@/components/ui/draft/setup/Step01.vue';
    import Step02 from '@/components/ui/draft/setup/Step02.vue';
    import Step03 from '@/components/ui/draft/setup/Step03.vue';
    import Step04 from '@/components/ui/draft/setup/Step04.vue';
    import Step05 from '@/components/ui/draft/setup/Step05.vue';
    import Step06 from '@/components/ui/draft/setup/Step06.vue';
    import Step07 from '@/components/ui/draft/setup/Step07.vue';
    import NavBar from '@/components/ui/NavBar.vue';

    const draftData: Ref<any> = useState('draftData')
    console.log('DRAFT DATA', draftData.value)
    const creationState: Ref<number> = ref(toRaw(draftData.value).status)
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false)

    console.log('STATUS STATUS STATUS', creationState.value, toRaw(draftData.value))

</script>

<template>
    <NavBar selected-dropdown-field="6" />

    <div id="setup-container" class="w-full h-[calc(100vh-60px)] flex flex-col relative items-center justify-start pr-[15px] pl-[15px] pb-[15px] box-border max-w-full overflow-scroll">
        <div class="w-full flex flex-col justify-start items-center h-full relative">
            <Transition class="w-full h-full" name="fade">
                <Step01 v-if="creationState <= 1 && !loadingState" />
                <Step02 v-else-if="creationState === 2 && !loadingState" />
                <Step03 v-else-if="creationState === 3 && !loadingState" />
                <Step04 v-else-if="creationState === 4 && !loadingState" />
                <Step05 v-else-if="creationState === 5 && !loadingState" />
                <Step06 v-else-if="creationState === 6 && !loadingState" />
                <Step07 v-else-if="creationState === 7 && !loadingState" />
                <LoadingAnimation id="loading" class="loading-shown absolute z-1" v-else/>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        opacity: 1;
        transition: opacity 0.5s ease-out;
    }

    .fade-enter-from {
        opacity: 0;
    }

    .fade-leave-to {
        opacity: 0;
    }

    .step {
        min-width: calc(100% / 8);
    }

</style>