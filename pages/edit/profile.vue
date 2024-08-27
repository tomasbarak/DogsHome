<script setup lang="ts">
    import isEqual from 'lodash/isEqual'
    import cloneDeep from 'lodash/cloneDeep'

    import WebsiteInput from '@/components/ui/inputs/WebsiteInput.vue';
    import VerifiedMark from '@/components/ui/icons/VerifiedMark.vue';
    import SocialInput from '@/components/ui/inputs/SocialInput.vue';
    import NormalInput from '@/components/ui/inputs/NormalInput.vue'
    import ImageSkeleton from '@/components/ui/ImageSkeleton.vue';
    import LongInput from '@/components/ui/inputs/LongInput.vue';
    import NavBar from '@/components/ui/NavBar.vue'


    const config = useRuntimeConfig();
    const { swalProfileCreationError } = useSwal()


    const apiUrl = config.public.context === 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl;

    const user = toRaw(useAuthStore().user)
    let profile: any = toRaw(useState('userProfile').value)
    // let profile: any = {
    //     "user_id": "lxfAgybtGDNpSINDa7b59uWJKmz2",
    //     "email": "mascotasenadopcionargentina@gmail.com",
    //     "creation_instance": 10,
    //     "name": "Tomás",
    //     "surname": "Barak",
    //     "accountType": 2,
    //     "shelter_name": "Mascotas en Adopcion Argentina",
    //     "photo_url": "http://www.mascotasenadopcion.com/docs/logomascotasenadopcion180.jpg",
    //     // "short_description": "Mascotas en adopción se formó inicialmente con el fin de poder rescatar, rehabilitar y luego dar en adopción aquellos perros.",
    //     "website": "www.mascotasenadopcion.com/",
    //     "social": {
    //         "instagram": "mascotasenadopcionargentina",
    //         "facebook": "mascotasenadopcionargentina",
    //         "twitter": "mascotasenadopcionargentina"
    //     },
    //     "accepted_terms": true,
    //     "is_verified_identity": true,
    // }

    const loadingState: Ref<boolean> = useState('loadingInstance', () => false);

    const editProfile = reactive(cloneDeep(profile))

    const hasDataChanged = ref(false)

    const stats: any = {
        "followers": 95000,
        "following": 300000,
        "posts": 0,
    }

    function kFormatter(num: number) {
        const abs_num = Math.abs(num)

        console.log(abs_num)

        if (abs_num < 1000) return num

        if (abs_num > 999 && abs_num < 999950) {
            return Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1)) + 'K'
        }

        if (abs_num >= 999950 && abs_num < 1000000000) {
            return Math.sign(num) * parseFloat((Math.abs(num) / 1000000).toFixed(1)) + 'M'
        }

        if (abs_num >= 1000000000) {
            return Math.sign(num) * parseFloat((Math.abs(num) / 1000000000).toFixed(1)) + 'B'
        }

        return Math.sign(num) * Math.abs(num)
    }

    let userNames: any = null

    if (profile.name && profile.surname) {
        userNames = profile.accountType != 0 ? profile.shelter_name :`${profile.name} ${profile.surname}`
    }

    useNuxtApp().hooks.hook('app:mounted', async () => {
        const { $auth } = useNuxtApp()
        await $auth.currentUser?.reload()
        console.log("FIREBASE USER HAS BEEN RELOADED")

        console.log($auth.currentUser)
        if ($auth.currentUser) {
            console.log("FIREBASE AUTH STORE UPDATED")
            const currentUser = $auth.currentUser
            useAuthStore().updateUser(currentUser.email!, currentUser.emailVerified, currentUser.displayName!, currentUser.photoURL!, currentUser.uid, true)
        }

        profile = cloneDeep(toRaw(editProfile))
        hasDataChanged.value = !isEqual(toRaw(editProfile), profile)

        window.onbeforeunload = function() {
            if (hasDataChanged.value) {
                return "¿Estás seguro que deseas salir? Los cambios que realizaste no se guardarán."
            }
        }
    })

    const goToEdit = () => {
        window.location.href = '/editar/perfil'
    
    }

    const parseName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    const parseSurname = (surname: string) => {
        return surname.charAt(0).toUpperCase() + surname.slice(1)
    }

    const parseDisplayName = (name: string, surname: string) => {
        return `${parseName(name)} ${parseSurname(surname)}`
    }

    function isObject(value: any): boolean {
        return value && typeof value === 'object' && !Array.isArray(value);
    }

    function getChangedFields(original: any, edited: any): any {
        const changes: any = {};

        for (const key in edited) {
            if (isObject(edited[key]) && isObject(original[key])) {
                const nestedChanges = getChangedFields(original[key], edited[key]);
                if (Object.keys(nestedChanges).length > 0) {
                    changes[key] = nestedChanges;
                }
            } else if (!isEqual(original[key], edited[key])) {
                changes[key] = edited[key];
            }
        }

        return changes;
    }

    watch(editProfile, (newVal, oldVal) => {
        // Compare with profile
        hasDataChanged.value = !isEqual(toRaw(editProfile), profile)

        console.log("HAS DATA CHANGED?")
        console.log(toRaw(editProfile))
        console.log(profile)
    }, {deep: true})

    const readURL = () => {
        const input = document.getElementById('upload-photo') as HTMLInputElement;
        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                editProfile.photo_b64 = e.target?.result as string;
            };

            reader.readAsDataURL(input.files[0]);
        }
    }

    const securityChecks = () => {
        const profileToCehck = toRaw(editProfile)
        if (profileToCehck.name != undefined && profileToCehck.name.length < 2) {
            return {secure: false, message: 'El nombre es demasiado corto.'};
        }
        
        if (profileToCehck.name != undefined && profileToCehck.name.length > 50) {
            return {secure: false, message: 'El nombre es demasiado largo.'};
        }

        if (profileToCehck.surname != undefined && profileToCehck.surname.length < 2) {
            return {secure: false, message: 'El apellido es demasiado corto.'};
        }
        if (profileToCehck.surname != undefined && profileToCehck.surname.length > 50) {
            return {secure: false, message: 'El apellido es demasiado largo.'};
        }

        if (profileToCehck.shelter_name != undefined && profileToCehck.shelter_name.length < 2) {
            return {secure: false, message: 'El nombre del refugio es demasiado corto.'};
        }

        if (profileToCehck.short_description != undefined && profileToCehck.short_description.length > 140) {
            return {secure: false, message: 'La descripción corta es demasiado larga.'};
        }

        return {secure: true, message: ''};
    }

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

    const handleSuccessfullUpdate = () => {
        loadingState.value = false;
        profile = cloneDeep(toRaw(editProfile))
        hasDataChanged.value = !isEqual(toRaw(editProfile), profile)
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

    const deletePhoto = async () => {
        const delete_response = await fetch(`${apiUrl}/user/profile/image`, {
            method: 'DELETE',
            credentials: 'include'
        })

        if (delete_response.ok) {
            profile.photo_url = ''
            return true
        }

        const res_json = await delete_response.json()
        handleServerError(res_json.err)

        return false
    }

    const handleProfileUpdate = async () => {
        const changedFields = getChangedFields(profile, editProfile)

        loadingState.value = true;
        
        if (Object.keys(changedFields).length > 0) {
            console.log("CHANGED FIELDS")
            console.log(changedFields)

            //TODO: IMPLEMENTAR ENVIO DE DATOS A BACKEND

            const security = securityChecks()

            if (!security.secure) {
                swalProfileCreationError(security.message);
                loadingState.value = false;
                return
            }

            if (editProfile.photo_b64) {
                const uploadSuccessful = await uploadPhoto()
                if (!uploadSuccessful) {
                    return
                }
                console.log("UPLOAD SUCCESSFUL")
                delete editProfile.photo_b64
            }

            if (editProfile.photo_b64 == '') {
                const deleteSuccessful = await deletePhoto()
                if (!deleteSuccessful) {
                    return
                }
            }

            const response = await fetch(`${apiUrl}/user/profile/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "updates": editProfile }),
                credentials: 'include'
            })

            if (response.ok) {
                handleSuccessfullUpdate()
                return
            }

            const res_json = await response.json()
            handleServerError(res_json)
            return
        } else {
            console.log("¿Que carajo hacés? Todavía no cambiaste nada... ¿Cómo llegaste hasta acá? Volá de acá")
        }
    }

    const modal = ref<HTMLDialogElement | null>(null)

    const deleteProfilePicture = () => {
        editProfile.photo_b64 = ''
        editProfile.photo_url = ''
        profile.photo_url = ''
    }
    
    const dialogDeleteImage = () => {
        deleteProfilePicture()
        modal.value?.close()
    }

    const dialogChangeImage = () => {
        const input = document.getElementById('upload-photo') as HTMLInputElement;
        input.click()
        modal.value?.close()
    }
</script>

<template>
    <NavBar selected-dropdown-field="0"/>
    <section class="z-1 flex relative bg-[#079292] w-full h-[200px]">
        <div class="flex bg-[#333] relative w-[150px] h-[150px] rounded-full overflow-hidden left-[50%] translate-x-[-50%] bottom-[-100px] border-primary border-2 z-10 group">
            <ImageSkeleton v-if="editProfile.photo_b64" :source="editProfile.photo_b64" alt="Foto de perfil" class="group-hover:opacity-10 transition-opacity w-full h-full object-cover rounded-full bg-cover" />
            <ImageSkeleton v-else-if="profile.photo_url == null || profile.photo_url == '' || profile.photo_url == undefined" class="group-hover:opacity-30 transition-opacity" id="user-profile-picture" source="/images/default-user-image.png" alt="Default user profile picture" />
            <ImageSkeleton v-else class="group-hover:opacity-10 transition-opacity" id="user-profile-picture" :source="profile.photo_url" alt="User profile picture" errorSrc="/images/default-user-image.png" />
            <div class="absolute flex flex-row w-full h-full opacity-0 z-20 left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] group-hover:opacity-100 transition-opacity">
                <label for="upload-photo" class="hidden md:flex cursor-pointer grow justify-center items-center hover:bg-[rgba(255,255,255,0.15)] transition-colors">
                    <Icon name="ic:round-edit" color="#fff" class="w-[32px] h-[32px]"/>
                </label>
                <div @click="deleteProfilePicture" class="hidden md:flex cursor-pointer grow justify-center items-center hover:bg-[rgba(255,50,50,0.15)] transition-colors">
                    <Icon name="ic:round-delete" color="#fff" class="w-[32px] h-[32px]"/>
                </div>
                <div class="flex w-full h-full md:hidden cursor-pointer grpw justify-center items-center" onclick="change_image_modal.showModal()">

                </div>
            </div>
        </div>
        <input class="hidden" type="file" accept=".png, .jpg, .jpeg" name="file" id="upload-photo" @change="readURL"/>
        <VerifiedMark v-if="profile.is_verified_identity" color="#079292" name="ic:round-verified" class="absolute left-[50%] translate-x-[calc(-50%+50px)] bottom-[-50px] z-20" />
        <!-- <ul class="absolute bottom-[-100px] menu bg-white w-56 shadow-md rounded-[5px]">
            <li><a class="flex"><font class="flex flex-row grow">Editar</font> <Icon color="#d3d3d3" name="ic:round-edit" class="w-[24px] h-[24px]"></Icon></a></li>
            <li><a class="flex"><font class="flex flex-row grow">Eliminar</font> <Icon color="rgba(255,50,50,0.6)" name="ic:round-delete" class="w-[24px] h-[24px]"></Icon></a></li>
        </ul> -->
        <dialog ref="modal"id="change_image_modal" class="modal">
            <div class="modal-box rounded-md">
                <p class="py-4">¿Que vas a hacer con tu foto de perfil?</p>
                <div class="modal-action">
                <form method="dialog" class="flex grow gap-2">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn rounded-md">Cancelar</button>
                    <div class="flex flex-row grow"></div>
                    <a @click="dialogDeleteImage" class="btn rounded-md bg-error text-white">Borrar</a>
                    <a @click="dialogChangeImage" class="btn rounded-md bg-primary text-white">Cambiar</a>
                </form>
                </div>
            </div>
        </dialog>
    </section>
    <section class="pt-[70px] flex flex-col items-center relative w-full h-fit md:p-[150px] p-[32px] gap-y-[50px]">
        <div class="w-full">
            <h1 class="text-2xl font-extrabold text-[#333] w-full">Detalles personales</h1>
            <div class="divider mt-0"</div>
            <div class="w-full flex flex-col md:grid md:grid-cols-2 md:grid-flow-row md:auto-cols-fr gap-[25px] md:gap-[50px] pt-[9px]">
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Nombre</h3>
                    <NormalInput v-model="editProfile.name" class="max-w-full w-full h-[50px]" placeholder="Nombre" />
                </div>
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Apellido</h3>
                    <NormalInput v-model="editProfile.surname" class="max-w-full w-full h-[50px]" placeholder="Apellido" />
                </div>
            </div>
        </div>

        <div v-if="profile.accountType == 1" class="w-full">
            <h1 class="text-2xl font-extrabold text-[#333] w-full">Detalles del refugio</h1>
            <div class="divider mt-0"</div>
            <div class="w-full flex flex-col md:grid md:grid-cols-2 md:grid-flow-row md:auto-cols-fr gap-[25px] md:gap-[50px] pt-[9px]">
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Nombre del refugio</h3>
                    <NormalInput v-model="editProfile.shelter_name" class="max-w-full w-full h-[50px]" />
                </div>
            </div>
        </div>

        <div v-if="profile.accountType != 0"class="w-full">
            <h1 class="text-2xl font-extrabold text-[#333] w-full">Redes sociales</h1>
            <div class="divider mt-0"</div>
            <div class="w-full flex flex-col md:grid md:grid-cols-2 md:grid-flow-row md:auto-cols-fr gap-[25px] md:gap-[50px] pt-[9px]">
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Instagram</h3>
                    <SocialInput class="max-w-full w-full h-[50px]" socialNetworkBaseURL="https://instagram.com" v-model="editProfile.social.instagram" placeholder="ejemplo" type="url"/>
                </div>
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Facebook</h3>
                    <SocialInput class="max-w-full w-full h-[50px]" socialNetworkBaseURL="https://facebook.com" v-model="editProfile.social.facebook" placeholder="ejemplo" type="url"/>
                </div>
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Twitter</h3>
                    <SocialInput class="max-w-full w-full h-[50px]" socialNetworkBaseURL="https://twiiter.com" v-model="editProfile.social.twitter" placeholder="ejemplo" type="url"/>
                </div>
                <div class="">
                    <h3 class="text-l font-semibold text-[#333] w-full">Sitio web</h3>
                    <WebsiteInput class="max-w-full w-full h-[50px]" v-model="editProfile.website" placeholder='www.ejemplo.com' type="url"/>
                </div>
            </div>
        </div>

        <div v-if="profile.accountType != 0" class="w-full">
            <h1 class="text-2xl font-extrabold text-[#333] w-full">Descripción corta</h1>
            <div class="divider mt-0"</div>
            <div class="w-full flex flex-col md:grid md:grid-cols-2 md:grid-flow-row md:auto-cols-fr gap-[25px] md:gap-[50px] pt-[9px]">
                <div class="">
                    <LongInput v-model="editProfile.short_description" maxlength="140" placeholder="Somos El Gran Refugio, nuestro propósito es..." type="text"/>
                </div>
            </div>
        </div>
    </section>
    <button :disabled="!toRaw(hasDataChanged)" @click="handleProfileUpdate" :class="{'bg-primary': toRaw(hasDataChanged), 'bg-[#d3d3d3]': !toRaw(hasDataChanged)}" class="fixed bottom-[15px] right-[15px] h-[50px] w-[100px] text-white p-0 m-0 rounded-[4px] transition-colors">
        <span v-if="loadingState" class="relative loading loading-spinner loading-md"></span>
        <font v-else>Guardar</font>
    </button>
</template>