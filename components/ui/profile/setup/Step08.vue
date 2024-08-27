<script setup lang="ts">
    import SocialInput from '@/components/ui/inputs/SocialInput.vue';

    const creationState: Ref<number> = useState('creationInstance');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal();
    const profile = reactive({
        'instagram': '',
        'facebook': '',
        'twitter': ''
    });
    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const handleServerError = (error: any) => {
        console.error(error);
        switch (error) {
            case "INVALID_INSTAGRAM_USERNAME":
                swalProfileCreationError('El usuario de instagram ingresado parece no ser valido. Por favor, ingresá un usuario válido.');
                break;
            case "INVALID_FACEBOOK_USERNAME":
                swalProfileCreationError('El usuario de facebook ingresado parece no ser valido. Por favor, ingresá un usuario válido.');
                break;
            case "INVALID_TWITTER_USERNAME":
                swalProfileCreationError('El usuario de twitter ingresado parece no ser valido. Por favor, ingresá un usuario válido.');
                break;
            default:
                swalProfileCreationError('Ocurrió un error inesperado. Por favor, intentá nuevamente.');
                break;
        }

        loadingState.value = false;
    }

    const validateInputs = () => {
        //Check that the inputs are not empty
        if (!profile.instagram && !profile.facebook && !profile.twitter) {
            swalProfileCreationError('Por favor, completá al menos un campo.');
            return false;
        }

        return true
    }
    
    const handleStepSubmission = async () => {
        if (!validateInputs()) {
            return;
        }

        loadingState.value = true;

        try {
            const response = await fetch(`${apiUrl}/user/profile/creation/step/8`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'instagram': profile.instagram,
                    'facebook': profile.facebook,
                    'twitter': profile.twitter
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

            creationState.value = 8
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

            creationState.value = 7
        } catch (error) {
            console.error(error);
        }
    }

    // useNuxtApp().hooks.hook("app:created", () => {
    //     if (profileState.value) {
    //         if (profileState.value.shelter_name) {
    //             profile.website = String(profileState.value.website).charAt(0).toUpperCase() + String(profileState.value.website).slice(1)
    //         }
    //     }
    // });
</script>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">¿Estás en las redes?</h1>
        
        <span class="flex grow"></span>
        
        <div class="label p-0 w-[75vw] max-w-[350px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Instagram</span>
        </div>

        <SocialInput class="mb-[15px]" socialNetworkBaseURL="https://instagram.com" v-model="profile.instagram" placeholder="ejemplo" type="url"/>
        
        <div class="label p-0 w-[75vw] max-w-[350px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Facebook</span>
        </div>

        <SocialInput class="mb-[15px]" socialNetworkBaseURL="https://facebook.com" v-model="profile.facebook" placeholder="ejemplo" type="url"/>
        
        <div class="label p-0 w-[75vw] max-w-[350px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Twitter</span>
        </div>

        <SocialInput socialNetworkBaseURL="https://twitter.com" v-model="profile.twitter" placeholder="ejemplo" type="url"/>

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