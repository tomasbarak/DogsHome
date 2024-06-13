<script setup lang="ts">
    const creationState: Ref<number> = useState('creationInstance');
    const profileState: Ref<any> = useState('userProfile');
    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);
    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal() 
    const profile = reactive({
        'photo_url': '',
        'photo_b64': ''
    });
    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const handleServerError = (error: any) => {
        console.error(error);
        switch (error) {
            case "FILE_TOO_BIG":
                swalProfileCreationError('La imágen es demasiado grande. Por favor, seleccioná una imágen de menos de 5MB.');
                break;
            default:
                swalProfileCreationError('Ocurrió un error inesperado. Por favor, intentá nuevamente.');
                break;
        }

        loadingState.value = false;
    }

    const uploadPhoto = async () => {
        const formData = new FormData();
        const fileInput = document.querySelector('#upload-photo') as HTMLInputElement;

        if (fileInput.files?.length! > 0) {
            //Check if file size is less than 5MB
            if (fileInput.files![0].size > 1024 * 1024 * 5) {
                handleServerError("FILE_TOO_BIG");
                return false;
            }
            

            formData.append("file", fileInput.files![0]);

            const upload_response = await fetch(`${apiUrl}/user/profile/image`, {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'multipart/form-data'
                // },
                credentials: 'include',
                body: formData
            })

            if (upload_response.ok) {
                const response_json = await upload_response.json();
                profile.photo_url = response_json.photo;
                return true
            }

            const res_json = await upload_response.json()
            handleServerError(res_json.err)

            return false
        }
        
    }

    const handleStepSubmission = async () => {
        loadingState.value = true;

        try {
            const uploadSuccessful = await uploadPhoto()

            if (!uploadSuccessful) {
                loadingState.value = false;
                return;
            }

            const response = await fetch(`${apiUrl}/user/profile/creation/step/4`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'photo_url': profile.photo_url
                }),
                credentials: 'include',
            });

            if(response.ok) {
                const response_json = await response.json()
                creationState.value = response_json.nextInstance
                loadingState.value = false
                return
            }

            const res_json = await response.json()
            handleServerError(res_json)
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

            creationState.value = 4
        } catch (error) {
            console.error(error);
        }
    }

    const readURL = () => {
        const input = document.getElementById('upload-photo') as HTMLInputElement;
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                profile.photo_b64 = e.target?.result as string;
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
</script>

<template>
    <div class="absolute w-full top-0 left-0 h-full z-0 flex flex-col justify-start items-center">
        <span class="flex grow"></span>
        <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">Subí tu foto de perfil</h1>
        
        
        <span class="flex grow"></span>
        
        <label for="upload-photo" class="flex flex-col w-[200px] h-[200px] bg-slate-100 rounded-full border-dashed border-[3px] border-primary cursor-pointer">
            <img v-if="profile.photo_b64" :src="profile.photo_b64" alt="Foto de perfil" class="w-full h-full object-cover rounded-full bg-cover" />
            <div v-else class="relative flex w-full h-full justify-center items-center">
                <Icon color="#d3d3d3" name="ic:round-image-search" class="w-[100px] h-[100px]"></Icon>
            </div>
        </label>
        <h1 class="mt-[15px]">Click para seleccionar foto</h1>
        <input class="hidden" type="file" accept=".png, .jpg, .jpeg" name="file" id="upload-photo" @change="readURL"/>
        
        
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