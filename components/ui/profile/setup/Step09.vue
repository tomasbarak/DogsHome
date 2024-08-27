<script setup lang="ts">
    import TermsAndConditions from '@/components/ui/TermsAndConditions.vue';

    const creationState: Ref<number> = useState('creationInstance');
    const profileState: Ref<any> = useState('userProfile');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal() 
    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const handleServerError = (error: any) => {
        console.error(error);
        swalProfileCreationError('Ocurrió un error inesperado. Por favor, intentá nuevamente.');

        loadingState.value = false;
    }
    
    const handleStepSubmission = async () => {
        loadingState.value = true;

        try {
            const response = await fetch(`${apiUrl}/user/profile/creation/step/9`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'accepted_terms': true
                }),
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                window.location.href = "/home"
                return
            }

            const response_json = await response.json()
            handleServerError(response_json.err)
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

            creationState.value = 9
        } catch (error) {
            console.error(error);
        }
    }

</script>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">Términos y condiciones</h1>
        
        <span class="flex grow"></span>
        
        <div class="label p-0 w-[75vw] max-w-[350px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold"></span>
        </div>

        <TermsAndConditions class="flex flex-col w-full max-h-[50%] max-w-full overflow-scroll" />

        <span class="flex grow"></span>

        <div class="flex w-full flex-row items-center max-w-[350px] justify-center md:justify-end">
            <button @click="handleStepBack" class="h-[50px] w-[100px] bg-slate-100 text-[#333] p-0 m-0 rounded-[4px]">Atrás</button>
            <span class="flex grow"></span>
            <button @click="handleStepSubmission" class="h-[50px] w-[100px] bg-primary text-white p-0 m-0 rounded-[4px]">Aceptar</button>
        </div>
    </div>
</template>