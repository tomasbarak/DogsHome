<script setup lang="ts">
    import LongInput from '@/components/ui/inputs/LongInput.vue';

    const creationState: Ref<number> = useState('creationInstance');
    const profileState: Ref<any> = useState('userProfile');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal() 
    const profile = reactive({
        'short_description': '',
    });
    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const handleServerError = (error: any) => {
        console.error(error);
        switch (error) {
            case "DESCRIPTION_TOO_LONG":
                swalProfileCreationError('La descripción es demasiado larga. Por favor, ingresá una descripción de 140 caracteres o menos.');
                break;
            default:
                swalProfileCreationError('Ocurrió un error inesperado. Por favor, intentá nuevamente.');
                break;
        }

        loadingState.value = false;
    }

    const handleStepSubmission = async () => {
        loadingState.value = true;

        try {
            const response = await fetch(`${apiUrl}/user/profile/creation/step/6`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'short_description': profile.short_description
                }),
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                creationState.value = response_json.nextInstance
                loadingState.value = false
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

            creationState.value = 1
        } catch (error) {
            console.error(error);
        }
    }

    const handleStepSkip = async () => {
        loadingState.value = true;

        try {
            const response = await fetch(`${apiUrl}/user/profile/creation/step/skip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                creationState.value = response_json.nextInstance
                loadingState.value = false
                return
            }

            creationState.value = 6
        } catch (error) {
            console.error(error);
        }
    }

    useNuxtApp().hooks.hook("app:created", () => {
        if (profileState.value) {
            if (profileState.value.short_description) {
                profile.short_description = String(profileState.value.shelter_name).charAt(0).toUpperCase() + String(profileState.value.shelter_name).slice(1)
            }
        }
    });
</script>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">Contanos de vos</h1>
        
        <span class="flex grow"></span>
        
        <div class="label p-0 w-[75vw] max-w-[350px] mb-[15px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Descripción corta</span>
        </div>
        <LongInput v-model="profile.short_description" maxlength="140" placeholder="Somos El Gran Refugio, nuestro propósito es..." type="text"/>
        <div class="label p-0 w-[75vw] max-w-[350px] justify-end mt-[5px]">
            <span class="text-[8pt] p-0 text-left text-[#333] font-bold">{{ profile.short_description.length }}/140</span>
        </div>


        <span class="flex grow"></span>

        <div class="flex w-full h-fit flex-row items-center justify-end max-w-[350px]">
            <button @click="handleStepSkip" class="h-[40px] w-fit bg-none text-[#777] p-0 m-0">Saltar</button>
        </div>

        <div class="flex w-full flex-row items-center max-w-[350px] justify-center md:justify-end">
            <button @click="handleStepBack" class="h-[50px] w-[100px] bg-slate-100 text-[#333] p-0 m-0 rounded-[4px]">Atrás</button>
            <span class="flex grow"></span>
            <button @click="handleStepSubmission" class="h-[50px] w-[100px] bg-primary text-white p-0 m-0 rounded-[4px]">Siguiente</button>
        </div>
    </div>
</template>