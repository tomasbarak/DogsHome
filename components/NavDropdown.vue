<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'
    const { logoutUser } = useFirebaseAuth()
    import { ref } from 'vue'

    const user = toRaw(useAuthStore().user)
    const profile: any = toRaw(useState('userProfile').value)
    const logged: boolean = user.logged

    let userNames: any = null
    if (logged && user.name) {
        userNames = JSON.parse(user.name)
    }

    function handle_logout() {
        logoutUser()
        window.location.href = '/auth'
        // Delete the cookies named session and auth
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
</script>

<template>
    <ul class="menu bg-white rounded-[2px] shadow dropdown-content z-[1] top-[45px] min-w-[200px]">
        <li class="menu-title pb-0">Hola, {{ userNames != null ? userNames.nameAndSurname.displayName : "No Username" }}</li>
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
        <li v-if="profile.accountType == 1 || profile.accountType == 2">
            <a :href="`/perfil/lista/borradores/`" class="text-[#222] table-cell align-middle">
                <Icon color="#d3d3d3" name="ic:round-edit" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Borradores
            </a>
        </li>
        <li>
            <a :href="`/perfil/lista/favoritos`" class="text-[#222] table-cell align-middle">
                <Icon color="#d3d3d3" name="ic:round-favorite" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Favoritos
            </a>
        </li>
        <div class="divider my-[1px] cursor-default"></div>
        <li>
            <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                <Icon color="#d3d3d3" name="ic:round-chat-bubble" class="w-[24px] h-[24px] mr-[16px]"></Icon>
                Chats
            </a>
        </li>
        <div class="divider my-[1px] cursor-default"></div>
        <li v-if="profile.accountType == 1 || profile.accountType == 2">
            <a :href="`/perfil/${user.uid}`" class="text-[#222] table-cell align-middle">
                <Icon color="#d3d3d3" name="ic:round-add-circle" class="w-[24px] h-[24px] mr-[16px]"></Icon>
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