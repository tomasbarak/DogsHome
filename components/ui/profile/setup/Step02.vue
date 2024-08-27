<script setup lang="ts">
    const creationState: Ref<number> = useState('creationInstance');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal() 
    const profile = reactive({
        'account_type': 0,
    });

    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const securityChecks = () => {
        if (profile.account_type === null || profile.account_type === undefined || profile.account_type === -1) {
            return {secure: false, message: 'Por favor, completá todos los campos.'};
        }

        if (profile.account_type < 0 || profile.account_type > 2) {
            return {secure: false, message: 'Seleccione un tipo de cuenta válido.'};
        }

        return {secure: true, message: ''};
    }

    const handleSecurityChecks = () => {
        const securityChecksResult = securityChecks();

        if (!securityChecksResult.secure) {
            swalProfileCreationError(securityChecksResult.message);
            return false;
        }

        return true;
    }

    const handleServerError = (error: any) => {
        console.error(error);
        swalProfileCreationError('Ocurrió un error inesperado. Por favor, intentá nuevamente.');
        loadingState.value = false;
    }

    const handleStepSubmission = async () => {
        loadingState.value = true;

        if (!handleSecurityChecks()) {
            loadingState.value = false;
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/user/profile/creation/step/2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'account_type': profile.account_type
                }),
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                creationState.value = response_json.nextInstance
                loadingState.value = false
                return
            }

            handleServerError(await response.json())
            return
        } catch (error) {
            console.error(error);
        }
    }

    const handleStepBack = async () => {
        loadingState.value = true;

        try {
            const response = await fetch(`${apiUrl}/user/profile/creation/step/back`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                creationState.value = response_json.previousInstance
                loadingState.value = false
                return
            }

            creationState.value = 1
        } catch (error) {
            console.error(error);
        }
    }

    const handleSlide = (forward: boolean) => {
        if (forward) {
            profile.account_type >= 2 ? profile.account_type = 0 : profile.account_type += 1
        } else {
            profile.account_type <= 0 ? profile.account_type = 2 : profile.account_type -= 1
        }
    }

    const handleTypeSelection = (type: number) => {
        profile.account_type = type
        window.location.hash = `type${profile.account_type}`
    }

    useNuxtApp().hooks.hook('app:mounted', async () => {
        window.location.hash = `type${profile.account_type}`
    })
</script>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">Tipo de cuenta</h1>
        
        <span class="flex grow"></span>
        
        <div id="desktop" class="hidden md:flex flex-row items-center justify-center w-[100%] gap-[15px]">
            <div @click="handleTypeSelection(0)" id="d_type0" class="relative flex flex-col rounded-[8px] items-center justify-start cursor-pointe hover:translate-y-[-15px] transition-all" :class="{'d_type-active': profile.account_type === 0}">
                <img class="flex flex-row items-center justify-center w-[150px] h-[150px] rounded-[4px] bg-slate-100 p-[15px]" src="/images/adoptant.svg"/>
                <a class="font-['lato'] font-bold text-[14pt] mt-[15px]">Adoptante</a>
                <a data-tip="¡Quiero adoptar un perro!" class="absolute tooltip flex items-center justify-center top-[5px] right-[5px] w-[20px] h-[20px] rounded-full bg-slate-50">
                    <Icon color="#079292" name="ic:round-question-mark" class="w-[10px] h-[10px]"></Icon>
                </a>
            </div>
            <div @click="handleTypeSelection(1)" id="d_type1" class="relative flex flex-col rounded-[8px] items-center justify-start cursor-pointer hover:translate-y-[-15px] transition-all" :class="{'d_type-active': profile.account_type === 1}">
                <img class="flex flex-row items-center justify-center w-[150px] h-[150px] rounded-[4px] bg-slate-100 p-[15px]" src="/images/shelter.svg"/>
                <a class="font-['lato'] font-bold text-[14pt] mt-[15px]">Refugio</a>
                <a data-tip="¡Tengo muchos perros para dar en adopcion!" class="absolute tooltip flex items-center justify-center top-[5px] right-[5px] w-[20px] h-[20px] rounded-full bg-slate-50">
                    <Icon color="#079292" name="ic:round-question-mark" class="w-[10px] h-[10px]"></Icon>
                </a>
            </div>
            <div @click="handleTypeSelection(2)" id="d_type2" class="relative flex flex-col rounded-[8px] items-center justify-start cursor-pointer hover:translate-y-[-15px] transition-all" :class="{'d_type-active': profile.account_type === 2}">
                <img class="flex flex-row items-center justify-center w-[150px] h-[150px] rounded-[4px] bg-slate-100 p-[15px]" src="/images/single-shelter.svg"/>
                <a class="font-['lato'] font-bold text-[14pt] mt-[15px]">Rescatista</a>
                <a data-tip="¡Quiero dar en adopcion a uno o mas perros por mi cuenta!" class="absolute tooltip flex items-center justify-center top-[5px] right-[5px] w-[20px] h-[20px] rounded-full bg-slate-50">
                    <Icon color="#079292" name="ic:round-question-mark" class="w-[10px] h-[10px]"></Icon>
                </a>
            </div>
        </div>

        <div id="mobile" class="flex flex-row items-start justify-center md:hidden">
            <a class="flex flex-col w-[50px] h-[150px] items-center justify-center" :href="`#type${profile.account_type}`" @click="handleSlide(false)">
                <Icon color="#d3d3d3" name="ic:round-chevron-left" class="w-[32px] h-[32px]"></Icon>
            </a>
            <div  class="carousel w-[150px] overflow-x-hidden">
                <div id="type0" class="carousel-item relative w-full flex flex-col rounded-[8px] items-center justify-start cursor-pointer">
                    <img class="flex flex-row items-center justify-center w-[150px] h-[150px] rounded-[4px] bg-slate-100 p-[15px]" src="/images/adoptant.svg"/>
                    <a class="font-['lato'] font-bold text-[14pt] mt-[15px]">Adoptante</a>
                    <a onclick="adoptante_modal.showModal()" class="absolute flex items-center justify-center top-[5px] right-[5px] w-[20px] h-[20px] rounded-full bg-slate-50">
                        <Icon color="#079292" name="ic:round-question-mark" class="w-[10px] h-[10px]"></Icon>
                    </a>
                    <dialog id="adoptante_modal" class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="bg-slate-100 flex items-center justify-center absolute right-2 top-2 rounded-full h-[25px] w-[25px]">
                                    <Icon color="#333" name="ic:round-close" class="w-[15px] h-[15px]"></Icon>
                                </button>
                            </form>
                            <h3 class="font-bold text-lg">Soy una persona</h3>
                            <p class="py-4">¡Quiero adoptar un perro!</p>
                        </div>
                    </dialog>
                </div>
                <div id="type1" class="carousel-item relative w-fullflex flex-col rounded-[8px] items-center justify-start cursor-pointer">
                    <img class="flex flex-row items-center justify-center w-[150px] h-[150px] rounded-[4px] bg-slate-100 p-[15px]" src="/images/shelter.svg"/>
                    <a class="font-['lato'] font-bold text-[14pt] mt-[15px]">Refugio</a>
                    <a onclick="refugio_modal.showModal()" class="absolute flex items-center justify-center top-[5px] right-[5px] w-[20px] h-[20px] rounded-full bg-slate-50">
                        <Icon color="#079292" name="ic:round-question-mark" class="w-[10px] h-[10px]"></Icon>
                    </a>
                    <dialog id="refugio_modal" class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="bg-slate-100 flex items-center justify-center absolute right-2 top-2 rounded-full h-[25px] w-[25px]">
                                    <Icon color="#333" name="ic:round-close" class="w-[15px] h-[15px]"></Icon>
                                </button>
                            </form>
                            <h3 class="font-bold text-lg">Soy un refugio</h3>
                            <p class="py-4">¡Tengo muchos perros para dar en adopción!</p>
                        </div>
                    </dialog>
                </div>
                <div id="type2" class="carousel-item relative w-fullflex flex-col rounded-[8px] items-center justify-start cursor-pointer">
                    <img class="flex flex-row items-center justify-center w-[150px] h-[150px] rounded-[4px] bg-slate-100 p-[15px]" src="/images/single-shelter.svg"/>
                    <a class="font-['lato'] font-bold text-[14pt] mt-[15px]">Rescatista</a>
                    <a onclick="rescatista_modal.showModal()" class="absolute flex items-center justify-center top-[5px] right-[5px] w-[20px] h-[20px] rounded-full bg-slate-50">
                        <Icon color="#079292" name="ic:round-question-mark" class="w-[10px] h-[10px]"></Icon>
                    </a>
                    <dialog id="rescatista_modal" class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button class="bg-slate-100 flex items-center justify-center absolute right-2 top-2 rounded-full h-[25px] w-[25px]">
                                    <Icon color="#333" name="ic:round-close" class="w-[15px] h-[15px]"></Icon>
                                </button>
                            </form>
                            <h3 class="font-bold text-lg">Soy un rescatista</h3>
                            <p class="py-4">¡Quiero dar en adopción a uno o más perros por mi cuenta!</p>
                        </div>
                    </dialog>
                </div>
            </div>

            <a class="flex flex-col w-[50px] h-[150px] items-center justify-center" :href="`#type${profile.account_type}`" @click="handleSlide(true)">
                <Icon color="#d3d3d3" name="ic:round-chevron-right" class="w-[32px] h-[32px]"></Icon>
            </a>
        </div>

        <span class="flex grow"></span>

        <div class="flex w-full flex-row items-center max-w-[350px] justify-center md:justify-end">
            <button @click="handleStepBack" class="h-[50px] w-[100px] bg-slate-100 text-[#333] p-0 m-0 rounded-[4px]">Atrás</button>
            <span class="flex grow"></span>
            <button @click="handleStepSubmission" class="h-[50px] w-[100px] bg-primary text-white p-0 m-0 rounded-[4px]">Siguiente</button>
        </div>
    </div>
</template>

<style scoped>
    .d_type-active {
        transform: translateY(-15px);
        border: 3px solid #079292;
        border-radius: 8px;
        box-sizing: border-box;
    }
</style>