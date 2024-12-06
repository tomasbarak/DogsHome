<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'
    import { ref } from 'vue'
    const { logoutUser } = useFirebaseAuth()

    const user = toRaw(useAuthStore().user)
    const profile: any = toRaw(useState('userProfile').value)
    const logged: boolean = user.logged

    let userNames: any = null
    if (logged && profile.name && profile.surname) {
        userNames = `${(profile.name)} ${profile.surname}`
    }

    function handle_logout() {
        logoutUser()
        window.location.href = '/auth'
        // Delete the cookies named session and auth
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
</script>

<style scoped>
    .selected > a {
        background-color: #f5f5f5;
        color: #079292;
        font-weight: bolder
    }
</style>

<template>
    <ul class="menu bg-white rounded-[2px] shadow dropdown-content top-[45px] min-w-[200px]">
        <li class="menu-title pb-0 capitalize">Hola, {{ userNames != null ? userNames : "No Username" }}</li>
        <li class="menu-title pt-0 text-black/[.22]">{{ profile.email }}</li>
        <li :class="{'selected': Number(selectedFieldIndex) == 0}">
            <a :href="`/inicio`" class="text-[#222] table-cell align-middle">
                <Icon :color="Number(selectedFieldIndex) != 0 ? '#d3d3d3' : '#079292'" name="ic:round-home" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Inicio
            </a>
        </li>
        <div class="divider my-[1px] cursor-default"></div>
        <li :class="{'selected': Number(selectedFieldIndex) == 1}">
            <a :href="`/perfil`" class="text-[#222] table-cell align-middle">
                <Icon :color="Number(selectedFieldIndex) != 1 ? '#d3d3d3' : '#079292'" name="ic:round-person" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Perfil
            </a>
        </li>
        <li :class="{'selected': Number(selectedFieldIndex) == 2}">
            <a :href="`/editar/perfil`" class="text-[#222] table-cell align-middle">
                <Icon :color="Number(selectedFieldIndex) != 2 ? '#d3d3d3' : '#079292'" name="ic:round-library-books" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Mis Datos
            </a>
        </li>
        <div class="divider my-[1px] cursor-default"></div>
        <li :class="{'selected': Number(selectedFieldIndex) == 3}" v-if="profile.accountType == 1 || profile.accountType == 2">
            <a :href="`/perfil/lista/borradores/`" class="text-[#222] table-cell align-middle">
                <Icon :color="Number(selectedFieldIndex) != 3 ? '#d3d3d3' : '#079292'" name="ic:round-edit" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Borradores
            </a>
        </li>
        <li :class="{'selected': Number(selectedFieldIndex) == 4}">
            <a :href="`/perfil/lista/favoritos`" class="text-[#222] table-cell align-middle">
                <Icon :color="Number(selectedFieldIndex) != 4 ? '#d3d3d3' : '#079292'" name="ic:round-favorite" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Favoritos
            </a>
        </li>
        <div class="divider my-[1px] cursor-default"></div>
        <li :class="{'selected': Number(selectedFieldIndex) == 5}">
            <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                <Icon  :color="Number(selectedFieldIndex) != 5 ? '#d3d3d3' : '#079292'" name="ic:round-chat-bubble" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Chats
            </a>
        </li>
        <div class="divider my-[1px] cursor-default"></div>
        <li :class="{'selected': Number(selectedFieldIndex) == 6}" v-if="profile.accountType == 1 || profile.accountType == 2">
            <a :href="`/publicar`" class="text-[#222] table-cell align-middle">
                <Icon :color="Number(selectedFieldIndex) != 6 ? '#d3d3d3' : '#079292'" name="ic:round-add-circle" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Publicar
            </a>
        </li>
        <div v-if="profile.accountType == 1 || profile.accountType == 2" class="divider my-[1px] cursor-default"></div>
        <li>
            <a class="text-[#ff3333] table-cell align-middle" @click="handle_logout">
                <Icon color="#ff3333" name="ic:round-log-out" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Cerrar sesión
            </a>
        </li>
    </ul>
</template>

<script lang="ts">
    export default {
        props: {
            selectedFieldIndex: {
                type: String
            }
        }
    }
</script>