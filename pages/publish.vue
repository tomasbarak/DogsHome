<script setup lang="ts">
    import NavBar from '@/components/ui/NavBar.vue';

    const { swalAuthError } = useSwal() 
    const config = useRuntimeConfig()
    
    const apiUrl = config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const handleServerError = (response_code: string) => {
        switch (response_code) {
            case 'TOO_MANY_DRAFTS':
                swalAuthError('Ya tenés muchos borradores pendientes. Publicá uno antes de crear otro.');
                break;
            default:
                swalAuthError('Hubo un error al intentar crear el borrador. Por favor, intentá de nuevo más tarde.');
                break;
        }
    }

    const handleStart = async () => {
        const draft_request = await fetch(`${apiUrl}/drafts/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const response_json = await draft_request.json();
        
        if (draft_request.ok) {
            window.location.href = `/crear/borrador/${response_json.publication_id}`;
            return;
        }
        
        
        handleServerError(response_json.err)
    }
</script>

<template>
    <NavBar selected-dropdown-field="6" />
    <div class="flex flex-col h-screen max-h-[calc(100vh-60px)] box-border w-full">
        <section class="flex items-center justify-center bg-[#079292] w-full h-full min-h-[200px] max-h-[200px]">
            <h1 class="font-extrabold text-[24pt] sm:text-[32pt] text-white">Crear publicación</h1>
        </section>
        <section class="flex flex-col grow h-fit w-full p-[32px]">
            <h1 class="font-bold text-[20pt] text-neutral-500 sm:text-[22pt] sm:font-normal text-center w-full"><font class="block text-black sm:block text-[20pt] md:text-[26pt] font-bold">¡Estás a punto de publicar!</font>Solo tenés que seguir unos pasos</h1>
        </section>
        <section class="w-full h-full flex flex-row items-center justify-center min-h-[200px]">
            <button @click="handleStart" class="h-[50px] w-[100px] text-white bg-primary p-0 m-0 rounded-[4px] transition-colors">Empezar</button>
        </section>
        <a class="absolute bottom-[15px] right-[15px] font-['libel-suit-rg'] w-auto text-center text-primary text-[24px]">DogsHome</a>
    </div>
</template>