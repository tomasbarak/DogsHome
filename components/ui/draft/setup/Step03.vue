<script setup lang="ts">
    const draftData: Ref<any> = useState('draftData');
    const draftTitle: string = toRaw(draftData.value).title;

    const creationState: Ref<number> = useState('creationInstance');
    const profileState: Ref<any> = useState('userProfile');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal() 
    const profile = reactive({
        'province_id': '-1',
        'locality_id': '-1'
    });
    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const handleServerError = (error: any) => {
        console.error(error);
        switch (error) {
            default:
                swalProfileCreationError('Ocurrió un error inesperado. Por favor, intentá nuevamente.');
                break;
        }

        loadingState.value = false;
    }

    const handleStepSubmission = async () => {
        loadingState.value = true;

        try {
            const response = await fetch(`${apiUrl}/user/draft/creation/step/3`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'province_id': profile.province_id,
                    'locality_id': profile.locality_id
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
            const response = await fetch(`${apiUrl}/user/draft/creation/step/back`, {
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

    const getProvinces = async () => {
        try {
            const response = await fetch(`${apiUrl}/geo/provinces/name`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                console.log('Provinces fetched:', response_json); // Debugging log
                return response_json
            }

            return []
        } catch (error) {
            console.error(error);
            return []
        }
    }

    const getLocalities = async (province_id: number) => {
        try {
            const response = await fetch(`${apiUrl}/geo/localities/province/${province_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                return response_json
            }

            return []
        } catch (error) {
            console.error(error);
            return []
        }
    }

    const provinces = reactive<any[]>([]);
    const localities = reactive<any[]>([]);

    onMounted(async () => {
        const fetchedProvinces = await getProvinces();
        provinces.push(...fetchedProvinces);
    });

    const handleSelectedProvince = async (event: any) => {
        profile.locality_id = '-1';
        const value = event.target.value;
        const fetchedLocalities = await getLocalities(value);
        localities.splice(0, localities.length);
        localities.push(...fetchedLocalities);
        localities.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
</script>

<style scoped>
    #dog-name {
        background: radial-gradient(circle,#079292,yellow);
        background-clip: text;
        animation: dog_name 5s linear infinite;
        color: transparent;
        text-transform: capitalize;
        background-size: 200% 200%;
    }

    @keyframes dog_name {
        0%{
            background-position: 0% 0%;
        }
        
        50%{
            background-position: 100% 100%;
        }
        
        100%{
            background-position: 0% 0%;
        }
    }
</style>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">¿De qué zona es <font id="dog-name">{{ draftTitle }}</font>?</h1>
        
        <span class="flex grow"></span>
        
        <div class="label p-0 w-[75vw] max-w-[350px] mb-[15px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Provincia</span>
        </div>
        <select class="select w-[75vw] max-w-[350px] !outline-none !border-none shadow-md !rounded-md focus:!outline-none focus:!border-none focus:!shadow-md focus:!rounded-md" @change="handleSelectedProvince" v-model="profile.province_id">
            <option disabled selected value="-1">Seleccioná tu provincia</option>
            <option v-for="province in provinces" :value="province.id">{{ province.nombre }}</option>
        </select>       
         
        <span class="flex h-[50px]"></span>
        
        <div class="label p-0 w-[75vw] max-w-[350px] mb-[15px]">
            <span class="text-[12pt] p-0 text-left text-[#333] font-bold">Localidad</span>
        </div>
        <select class="select w-[75vw] max-w-[350px] !outline-none !border-none shadow-md !rounded-md focus:!outline-none focus:!border-none focus:!shadow-md focus:!rounded-md" v-model="profile.locality_id">
            <option disabled selected value="-1">Seleccioná tu localidad</option>
            <option v-for="locality in localities" :value="locality.id">{{ locality.nombre }}</option>
        </select>

        <span class="flex grow"></span>

        <div class="flex w-full flex-row items-center max-w-[350px] justify-center md:justify-end">
            <button @click="handleStepBack" class="h-[50px] w-[100px] bg-slate-100 text-[#333] p-0 m-0 rounded-[4px]">Atrás</button>
            <span class="flex grow"></span>
            <button @click="handleStepSubmission" class="h-[50px] w-[100px] bg-primary text-white p-0 m-0 rounded-[4px]">Siguiente</button>
        </div>
    </div>
</template>