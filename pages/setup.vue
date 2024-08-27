<script setup lang="ts">
    import LoadingAnimation from '@/components/ui/animations/LoadingAnimation.vue';
    import Step01 from '@/components/ui/profile/setup/Step01.vue';
    import Step02 from '@/components/ui/profile/setup/Step02.vue';
    import Step03 from '@/components/ui/profile/setup/Step03.vue';
    import Step04 from '@/components/ui/profile/setup/Step04.vue';
    import Step05 from '@/components/ui/profile/setup/Step05.vue';
    import Step06 from '@/components/ui/profile/setup/Step06.vue';
    import Step07 from '@/components/ui/profile/setup/Step07.vue';
    import Step08 from '@/components/ui/profile/setup/Step08.vue';
    import Step09 from '@/components/ui/profile/setup/Step09.vue';


    const { logoutUser } = useFirebaseAuth()

    const creationState: Ref<number> = useState('creationInstance')
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false)

    // creationState.value = 9

    function handle_logout() {
        logoutUser()
        window.location.href = '/auth'
        // Delete the cookies named session and auth
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
</script>

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

<template>

    <div class="flex flex-row h-full items-center justify-start">

        <img src="/images/DogsHomeLogo-ReDesign%20(White&Final).png" alt="DogsHome logo" id="logo" class="md:visible invisible absolute w-[50px] h-[50px] top-[15px] left-[15px]">
        <img src="/images/DogsHomeLogo-ReDesign%20(Colorified&Final).png" alt="DogsHome logo" id="logo" class="visible md:invisible absolute w-[50px] h-[50px] top-[15px] right-[15px]">
        <!-- <a class="absolute hidden top-[15px] right-[15px] text-center text-[#ff3333] text-[16px] cursor-pointer" @click="logoutUser(); navigateTo('/auth')">Cerrar sesión</a> -->

        <svg class="max-h-screen h-screen w-[50px] md:w-[400px]" viewBox="0 0 320 1440" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_1">
                <title>Layer 1</title>
                <g id="svg_1" transform="rotate(90, 159.909, 719.709)">
                <path id="svg_2" fill="#079292" d="m-560.09116,650.12319l80,25.42733c80,25.90484 240,76.04324 400,57.30103c160,-19.45847 320,-107.79756 480,-146.35638c160,-37.84255 320,-25.90484 400,-19.10034l80,6.32699l0,305.60548l-80,0c-80,0 -240,0 -400,0c-160,0 -320,0 -480,0c-160,0 -320,0 -400,0l-80,0l0,-229.20411z"></path>
            </g>
            </g>
        </svg>
        
        <!-- <WaitingDogAnimation class="absolute bottom-0 left-0" /> -->

        <div id="setup-container" class="w-full h-screen flex flex-col relative items-center justify-start pr-[15px] pl-[15px] pt-[50px] pb-[50px] box-border max-w-full">
            <!-- <ul class="hidden md:steps md:flex md:flex-row md:w-full md:items-center md:justify-center md:mb-[50px]">
                <li class="step" data-content="" :class="{'step-primary': creationState >= 1}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 2}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 3}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 4}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 5}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 6}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 7}"></li>
                <li class="step" data-content="" :class="{'step-primary': creationState >= 8}"></li>
            </ul> -->
            <div class="max-w-[500px] w-full flex flex-col justify-start items-center h-full relative">
                <Transition class="w-full h-full" name="fade">
                    <Step01 v-if="creationState <= 1 && !loadingState" />
                    <Step02 v-else-if="creationState === 2 && !loadingState" />
                    <Step03 v-else-if="creationState === 3 && !loadingState" />
                    <Step04 v-else-if="creationState === 4 && !loadingState" />
                    <Step05 v-else-if="creationState === 5 && !loadingState" />
                    <Step06 v-else-if="creationState === 6 && !loadingState" />
                    <Step07 v-else-if="creationState === 7 && !loadingState" />
                    <Step08 v-else-if="creationState === 8 && !loadingState" />
                    <Step09 v-else-if="creationState === 9 && !loadingState" />
                    <LoadingAnimation id="loading" class="loading-shown absolute z-1" v-else/>
                </Transition>
            </div>
        </div>

        <a class="absolute invisible bottom-[15px] right-[15px] font-['libel-suit-rg'] w-auto text-center text-primary text-[24px] md:visible">DogsHome</a>
    </div>
</template>
