<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'
    import { ref } from 'vue'

    const user = toRaw(useAuthStore().user)
    const logged: boolean = user.logged
    const menuVisible = ref(false)

    let userNames: any = null
    if (logged && user.name) {
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
                <Icon color="#d3d3d3" name="ic:round-keyboard-arrow-down" class="w-[24px] h-[24px] transition-transform" :class="{ 'rotate-[-180deg]': menuVisible}"></Icon>

                <a class="flex max-h-[40px] justify-center items-center m-0 ml-[10px]">
                    <h1 class="text-white text-center font-bold"> {{ userNames != null ? userNames.nameAndSurname.displayName : "No Username"}}</h1>
                </a>

                <div class="w-[40px] h-[40px] rounded-full ml-[10px]">
                    <img id="user-profile-picture" class="cursor-pointer" src="/images/default-user-image.png" alt="Default user profile picture" v-if="user.picture == null || user.picture == '' || user.picture == undefined">
                    <img id="user-profile-picture" class="cursor-pointer" :src="user.picture" alt="User profile picture" onerror="this.onerror=null; this.src='/images/default-user-image.png'" v-else>
                </div>

                <NavDropdown />
            </div>
            <div class="avatar" v-else>
                <div class="w-[40px] h-[40px] rounded-full">
                    <img id="user-profile-picture" class="cursor-pointer" src="/images/default-private-user-image.png" alt="Anonymous user profile picture" onclick="window.location = '/auth'">
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