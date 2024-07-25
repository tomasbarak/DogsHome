<script setup lang="ts">
    import NormalInput from '@/components/ui/edit/profile/NormalInput.vue'
    import { isEqual, cloneDeep } from 'lodash'

    const user = toRaw(useAuthStore().user)
    // const profile: any = toRaw(useState('userProfile').value)

    const profile: any = {
        "user_id": "lxfAgybtGDNpSINDa7b59uWJKmz2",
        "email": "mascotasenadopcionargentina@gmail.com",
        "creation_instance": 10,
        "name": "Tomás",
        "surname": "Barak",
        "accountType": 2,
        "shelter_name": "Mascotas en Adopcion Argentina",
        "photo_url": "http://www.mascotasenadopcion.com/docs/logomascotasenadopcion180.jpg",
        "short_description": "Mascotas en adopción se formó inicialmente con el fin de poder rescatar, rehabilitar y luego dar en adopción aquellos perros.",
        "website": "www.mascotasenadopcion.com/",
        "social": {
            "instagram": "mascotasenadopcionargentina",
            "facebook": "mascotasenadopcionargentina",
            "twitter": "mascotasenadopcionargentina"
        },
        "accepted_terms": true,
        "is_verified_identity": true,
    }

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
    }, {deep: true})

    const handleProfileUpdate = async () => {
        const changedFields = getChangedFields(profile, editProfile)
        
        if (Object.keys(changedFields).length > 0) {
            console.log("CHANGED FIELDS")
            console.log(changedFields)

            //TODO: IMPLEMENTAR ENVIO DE DATOS A BACKEND
        } else {
            console.log("¿Que carajo hacés? Todavía no cambiaste nada... ¿Cómo llegaste hasta acá? Volá de acá")
        }
    }
</script>

<template>
    <NavBar selected-dropdown-field="0"/>
    <section class="flex relative bg-[#079292] w-full h-[200px]">
        <div class="flex cursor-pointer bg-black relative w-[150px] h-[150px] rounded-full overflow-hidden left-[50%] translate-x-[-50%] bottom-[-100px] border-primary border-2 z-10 group">
            <img class="group-hover:opacity-30 transition-opacity" id="user-profile-picture" src="/images/default-user-image.png" alt="Default user profile picture" v-if="profile.photo_url == null || profile.photo_url == '' || profile.photo_url == undefined">
            <img class="group-hover:opacity-30 transition-opacity" id="user-profile-picture" :src="profile.photo_url" alt="User profile picture" onerror="this.onerror=null; this.src='/images/default-user-image.png'" v-else>
            <Icon name="ic:round-edit" color="#fff" class="opacity-0 z-20 w-[32px] h-[32px] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] group-hover:opacity-100 transition-opacity"/>
        </div>
        <VerifiedMark v-if="profile.is_verified_identity" color="#079292" name="ic:round-verified" class="absolute left-[50%] translate-x-[calc(-50%+50px)] bottom-[-50px] z-20" />
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
    <button :disabled="!toRaw(hasDataChanged)" @click="handleProfileUpdate" :class="{'bg-primary': toRaw(hasDataChanged), 'bg-[#d3d3d3]': !toRaw(hasDataChanged)}" class="fixed bottom-[15px] right-[15px] h-[50px] w-[100px] text-white p-0 m-0 rounded-[4px] transition-colors">Guardar</button>
</template>