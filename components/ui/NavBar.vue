<script setup lang="ts">
    import ImageSkeleton from '@/components/ui/ImageSkeleton.vue';
    import NavDropdown from '@/components/ui/NavDropdown.vue';

    import { useAuthStore } from '@/stores/authStore'
    import { ref } from 'vue'

    const user = toRaw(useAuthStore().user)
    const profile: any = toRaw(useState('userProfile').value)
    const logged: boolean = user.logged
    const menuVisible = ref(false)

    console.log("USER PROFILE", profile)

    let userNames: any = null
    if (logged && profile.name && profile.surname) {
        userNames = `${(profile.name)} ${profile.surname}`
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
</script>

<template>
    <div class="navbar bg-primary h-[60px] pt-[10px] pb-[10px] pr-[8px] pl-[8px] min-h-[60px]">
        <div class="md:navbar-start">
            <img src="/images/DogsHomeLogo-ReDesign (White&Final).png" class="w-0 md:w-[40px] md:h-[40px]" alt="">
            <a href="" class="link-neutral"></a>
        </div>
        <div class="navbar-start w-full md:w-auto md:navbar-center h-full ml-[8px] mr-[8px]">
            <div class="flex p-0 m-0 h-full w-full md:w-[100vw] md:max-w-[400px] rounded-[2px] bg-neutral ">
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
        <div class="navbar-end w-fit md:w-[50%]">
            <div tabindex="0" role="button" class="avatar dropdown w-fit justify-end flex flex-row items-center md:pl-[10px]" v-if="logged" @focusout="menuVisible = !menuVisible" @focusin="menuVisible = !menuVisible">
                <Icon color="#d3d3d3" name="ic:round-keyboard-arrow-down" class="w-[24px] h-[24px] transition-transform" :class="{ 'rotate-[-180deg]': menuVisible}"></Icon>

                <a class="invisible w-0 m-0 flex md:w-auto md:visible max-h-[40px] justify-center items-center md:ml-[10px]">
                    <h1 class="invisible text-ellipsis whitespace-nowrap overflow-hidden max-w-[200px] md:visible md:text-white md:text-center md:font-bold md:capitalize"> {{ userNames != null ? userNames : "No Username"}}</h1>
                </a>

                <div class="w-[40px] h-[40px] rounded-full ml-[10px]">
                    <ImageSkeleton id="user-profile-picture" class="cursor-pointer" source="/images/default-user-image.png" alt="Default user profile picture" v-if="user.picture == null || user.picture == '' || user.picture == undefined" />
                    <ImageSkeleton id="user-profile-picture" class="cursor-pointer" errorSrc="/images/default-user-image.png" :source="profile.photo_url" alt="User profile picture" onerror="this.onerror=null; this.src='/images/default-user-image.png'" v-else />
                </div>

                <NavDropdown :selected-field-index="selectedDropdownField" class="z-[100]"/>
            </div>
            <div class="avatar" v-else>
                <div class="w-[40px] h-[40px] rounded-full">
                    <ImageSkeleton id="user-profile-picture" class="cursor-pointer" source="/images/default-private-user-image.png" alt="Anonymous user profile picture" onclick="window.location = '/auth'" />
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
            selectedDropdownField: {
                type: String
            }
        }
    }
</script>

<style scoped>
</style>