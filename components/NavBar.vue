<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'
    import { ref } from 'vue'

    const user = toRaw(useAuthStore().user)
    const logged: boolean = user.logged
    const menuVisible = ref(false)

    let userNames: any = null
    if (logged) {
        userNames = JSON.parse(user.name)
    }

    console.log(user)
</script>

<template>
    <div class="navbar bg-primary h-[60px] pt-[10px] pb-[10px] pr-[8px] pl-[8px] min-h-[60px]">
        <div class="navbar-start">
            <img src="/images/DogsHomeLogo-ReDesign (White&Final).png" class="w-[40px] h-[40px]" alt="">
            <a href="" class="link-neutral"></a>
        </div>
        <div class="navbar-center h-full">
            <div class="flex p-0 m-0 h-full w-[100vw] max-w-[400px] rounded-[2px] bg-neutral ">
                <div class="flex justify-center items-center w-[44px] group cursor-pointer">
                    <Icon color="#d3d3d3" name="ic:outline-tune" class="w-[24px] h-[24px] transition ease-out group-hover:!text-primary transition ease-in"></Icon>
                </div>
                <div class="divider divider-horizontal m-0 mb-[5px] mt-[5px] w-[1px]"></div>
                <input placeholder="Buscar en DogsHome..." type="text" class="input w-full p-0 h-full rounded-none focus:outline-none pr-[10px] pl-[10px]">
                <div class="divider divider-horizontal m-0 mb-[5px] mt-[5px] w-[1px]"></div>
                <div class="flex justify-center items-center w-[44px] cursor-pointer group">
                    <Icon color="#d3d3d3" name="ic:outline-search" class="w-[24px] h-[24px] transition ease-out group-hover:!text-primary transition ease-in"></Icon>
                </div>
            </div>
        </div>
        <div class="navbar-end">
            <div tabindex="0" role="button" class="avatar dropdown w-fit justify-end flex flex-row items-center pl-[10px]" v-if="logged" @focusout="menuVisible = !menuVisible" @focusin="menuVisible = !menuVisible">
                <Icon color="#d3d3d3" name="ic:round-keyboard-arrow-down" class="w-[24px] h-[24px]" :class="{ 'rotate-180': menuVisible}"></Icon>

                <a class="flex max-h-[40px] justify-center items-center m-0 ml-[10px]">
                    <h1 class="text-white text-center font-bold"> {{ userNames.nameAndSurname.displayName }}</h1>
                </a>

                <div class="w-[40px] h-[40px] rounded-full ml-[10px]">
                    <img id="user-profile-picture" class="cursor-pointer" src="/images/default-user-image.png" alt="Default user profile picture" v-if="user.picture == null || user.picture == '' || user.picture == undefined">
                    <img id="user-profile-picture" class="cursor-pointer" :src="user.picture" alt="User profile picture" onerror="this.onerror=null; this.src='/images/default-user-image.png'" v-else>
                </div>

                <ul class="menu bg-white rounded-[2px] shadow dropdown-content z-[1] top-[45px] min-w-[200px]">
                    <li class="menu-title pb-0">Hola, {{ userNames.nameAndSurname.displayName }}</li>
                    <li class="menu-title pt-0 text-black/[.22]">{{ user.email }}</li>
                    <li>
                        <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                            <Icon color="#d3d3d3" name="ic:round-person" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Perfil
                        </a>
                    </li>
                    <li>
                        <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                            <Icon color="#d3d3d3" name="ic:round-library-books" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Mis Datos
                        </a>
                    </li>
                    <div class="divider my-[1px] cursor-default"></div>
                    <li>
                        <a :href="`/perfil/lista/borradores/`" class="text-[#222] table-cell align-middle">
                            <Icon color="#d3d3d3" name="ic:round-edit" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Borradores
                        </a>
                    </li>
                    <li>
                        <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                            <Icon color="#d3d3d3" name="ic:round-favorite" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Favoritos
                        </a>
                    </li>
                    <li>
                        <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                            <Icon color="#d3d3d3" name="ic:round-chat-bubble" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Chats
                        </a>
                    </li>
                    <li>
                        <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                            <Icon color="#d3d3d3" name="ic:round-add-circle" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Publicar
                        </a>
                    </li>
                    <div class="divider my-[1px] cursor-default"></div>
                    <li>
                        <a :href="`/perfil/${user.uid}`" class="text-[#ff3333] table-cell align-middle">
                            <Icon color="#ff3333" name="ic:round-log-out" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                            Cerrar sesión
                        </a>
                    </li>
                </ul>
            </div>
            <div class="avatar" v-else>
                <div class="w-[40px] h-[40px] rounded-full">
                    <img id="user-profile-picture" class="cursor-pointer" src="/images/default-private-user-image.png" alt="Anonymous user profile picture">
                </div>
            </div>

            
        </div>
    </div>
    
</template>

<script lang="ts">
    export default {
        props: {
            userName: {
                type: String,
            },
            userSurname: {
                type: String,
            },
            userPhotoURL: {
                type: String,
            },
            userAccountType: {
                type: String,
            },
        }
    }
</script>

<style scoped>
</style>