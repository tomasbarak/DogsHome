<script setup lang="ts">
    const user = toRaw(useAuthStore().user)
    // const profile: any = toRaw(useState('userProfile').value)

    const profile = {
        "user_id": "lxfAgybtGDNpSINDa7b59uWJKmz2",
        "email": "mascotasenadopcionargentina@gmail.com",
        "creation_instance": 10,
        "name": "Mascotas en Adopcion",
        "surname": "Argentina",
        "accountType": 1,
        "shelter_name": "Mascotas en Adopcion Argentina ",
        "photo_url": "http://www.mascotasenadopcion.com/docs/logomascotasenadopcion180.jpg",
        "short_description": "Mascotas en adopción se formó inicialmente con el fin de poder rescatar, rehabilitar y luego dar en adopción aquellos perros, gatos abandonados o maltratados en la zona de Del Viso, Partido de Pilar, aunque con el transcurrir del tiempo, hemos extendido nuestro trabajo abarcando Gran Buenos Aires y CABA.",
        "website": "www.mascotasenadopcion.com/",
        "social": {
            "instagram": "mascotasenadopcionargentina",
            "facebook": "mascotasenadopcionargentina"
        },
        "accepted_terms": true,
    }

    const stats = {
        "followers": 3400,
        "following": 30,
        "posts": 500,
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
</script>

<template>
    <NavBar selected-dropdown-field="0"/>
    <section class="flex relative bg-[#079292] w-full h-[200px]">
        <section class="absolute flex md:hidden flex-row justify-center w-full h-[100px] p-[16px] pt-0 box-border">
            <div class="flex flex-row">
                <div class="flex flex-col justify-center items-center mr-[0px] md:mr-[50px] w-[100px]">
                    <h1 class="text-3xl text-white font-extrabold">{{ kFormatter(stats.following) }}</h1>
                    <h3 class="text-white">Siguiendo</h3>
                </div>
                <div class="flex flex-col justify-center items-center mr-[0px] md:mr-[50px] w-[100px]">
                    <h1 class="text-3xl text-white font-extrabold">{{ kFormatter(stats.followers) }}</h1>
                    <h3 class="text-white">Seguidores</h3>
                </div>
                <div class="flex flex-col justify-center items-center w-[100px]">
                    <h1 class="text-3xl text-white font-extrabold">{{ kFormatter(stats.posts) }}</h1>
                    <h3 class="text-white">Publicaciones</h3>
                </div>
            </div>
        </section>
        <div class="flex absolute w-[150px] h-[150px] rounded-full overflow-hidden left-[50%] translate-x-[-50%] bottom-[-50px] border-primary border-2 z-10">
            <img id="user-profile-picture" src="/images/default-user-image.png" alt="Default user profile picture" v-if="profile.photo_url == null || profile.photo_url == '' || profile.photo_url == undefined">
            <img id="user-profile-picture" :src="profile.photo_url" alt="User profile picture" onerror="this.onerror=null; this.src='/images/default-user-image.png'" v-else>
        </div>
        <VerifiedMark color="#079292" name="ic:round-verified" class="absolute left-[50%] translate-x-[calc(-50%+50px)] bottom-[-50px] z-20" />
    </section>
    <section class="flex flex-row relative w-full h-[82px] p-[16px]">
        <div class="flex flex-row justify-center w-[50%] pr-[75px]">
            <button class="h-[50px] w-[100px] bg-white text-[#333] border-2 border-primary p-0 m-0 rounded-[4px] transition-colors hover:bg-primary hover:text-white">Contactar</button>
        </div>
        <div class="relative flex flex-row justify-center w-[50%] pl-[75px]">
            <section class="absolute hidden md:flex flex-row justify-center w-auto h-[100px] p-[16px] pt-0 top-[-100px]">
                <div class="flex flex-row">
                    <div class="flex flex-col justify-center items-center mr-[25px] md:mr-[0px] w-[100px]">
                        <h1 class="text-3xl text-white font-extrabold">{{ kFormatter(stats.following) }}</h1>
                        <h3 class="text-white">Siguiendo</h3>
                    </div>
                    <div class="flex flex-col justify-center items-center mr-[25px] md:mr-[0px] w-[100px]">
                        <h1 class="text-3xl text-white font-extrabold">{{ kFormatter(stats.followers) }}</h1>
                        <h3 class="text-white">Seguidores</h3>
                    </div>
                    <div class="flex flex-col justify-center items-center w-[100px]">
                        <h1 class="text-3xl text-white font-extrabold">{{ kFormatter(stats.posts) }}</h1>
                        <h3 class="text-white">Publicaciones</h3>
                    </div>
                </div>
            </section>
            <button class="h-[50px] w-[100px] bg-primary text-white p-0 m-0 rounded-[4px]">Seguir</button>
        </div>
    </section>
    <section class="flex flex-col items-center relative w-full h-[100px] p-[16px] pt-0">
        <div class="flex flex-row justify-center items-center mb-3">
            <h1 class="capitalize text-3xl font-bold text-center">{{ userNames }}</h1>
        </div>
    </section>
    <section v-if="profile.accountType != 0" class="flex flex-col items-start relative w-full h-auto p-[16px] md:p-[64px] pt-0">
        <h1 class="text-[#333] font-bold text-xl mb-[15px]">Sobre <font class="text-[#079292] capitalize"> {{ userNames }} </font></h1>
        <p class="flex justify-center items-center w-fit leading-5 text-left">{{ profile.short_description }}</p>
    </section>
</template>