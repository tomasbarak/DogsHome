<script setup lang="ts">
    import AuthInput from '@/components/ui/auth/AuthInput.vue';
    
    const creationState: Ref<number> = useState('creationInstance');
    const profileState: Ref<any> = useState('userProfile');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal() 
    const profile = reactive({
        'name': '',
        'surname': '',
    });
    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const securityChecks = () => {
        if (!profile.name || !profile.surname) {
            return {secure: false, message: 'Por favor, completá todos los campos.'};
        }

        if (profile.name.length < 2 || profile.surname.length < 2) {
            return {secure: false, message: 'El nombre o el apellido son demasiado cortos.'};
        }

        if (profile.name.length > 50 || profile.surname.length > 50) {
            return {secure: false, message: 'El nombre o el apellido son demasiado largos.'};
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
            const response = await fetch(`${apiUrl}/user/profile/creation/step/1`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': profile.name,
                    'surname': profile.surname,
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

    useNuxtApp().hooks.hook("app:created", () => {
        if (profileState.value) {
            if (profileState.value.name) {
                profile.name = String(profileState.value.name).charAt(0).toUpperCase() + String(profileState.value.name).slice(1)
            }

            if (profileState.value.surname) {
                profile.surname = String(profileState.value.surname).charAt(0).toUpperCase() + String(profileState.value.surname).slice(1)
            }
        }
    });
</script>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">¿Cómo te llamás?</h1>
        
        <span class="flex grow"></span>
        
        <div class="label p-0 w-[75vw] max-w-[350px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Nombre</span>
        </div>
        <AuthInput v-model="profile.name" placeholder="John" type="text"/>

        <div class="label p-0 w-[75vw] max-w-[350px] mt-[50px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Apellido</span>
        </div>
        <AuthInput v-model="profile.surname" placeholder="Doe" type="text"/>

        <span class="flex grow"></span>

        <div class="flex w-full flex-row items-center max-w-[350px] justify-center md:justify-end">
            <button @click="handleStepSubmission" class="h-[50px] w-[100px] bg-primary text-white p-0 m-0 rounded-[4px]">Siguiente</button>
        </div>
    </div>
</template>