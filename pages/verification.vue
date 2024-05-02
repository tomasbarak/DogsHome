<script setup lang="ts">
    import { useAuthStore } from '@/stores/authStore'

    const { sendVerificationEmail } = useSendVerificationEmail()
    const { logoutUser } = useFirebaseAuth()
    const { $auth } = useNuxtApp()

    const config = useRuntimeConfig()

    const isAuth = useState('isAuth')
    const resendCountdown: Ref<number> = useState('resendCountdown')

    function resetResendCountdown() {
        resendCountdown.value = 50000
    }

    function getResendCountdownString() {
        const minutes = Math.floor(resendCountdown.value / 60000)
        const seconds = Math.floor((resendCountdown.value % 60000) / 1000)
        return `${minutes}min ${seconds < 10 ? '0' : ''}${seconds}seg`
    }


    const user = useState('user')

    console.log(toRaw(user.value!))

    const handleSendVerificationEmail = async () => {
        await sendVerificationEmail()

        if (resendCountdown.value > 0) {
            return
        }

        resetResendCountdown()
        const resendCountdownTxt = document.querySelector('#resend-countdown')
        const resendBtn = document.querySelector('#resend-btn')

        resendBtn?.classList.toggle('text-primary')
        resendBtn?.classList.toggle('text-gray-300')
        resendBtn?.classList.toggle('cursor-not-allowed')
        resendCountdownTxt?.classList.toggle('hidden')

        const interval = setInterval(() => {
            resendCountdown.value -= 1000

            if (resendCountdown.value <= 0) {
                clearInterval(interval)
                resendCountdownTxt?.classList.toggle('hidden')
                resendBtn?.classList.toggle('text-primary')
                resendBtn?.classList.toggle('text-gray-300')
                resendBtn?.classList.toggle('cursor-not-allowed')
            }
        }, 1000)
    }

    useNuxtApp().hooks.hook('app:mounted', async () => {
        $auth.onAuthStateChanged((updatedUser: any) => {
            console.log('Auth state changed', updatedUser)
            if (updatedUser) {
                isAuth.value = true

                const interval = setInterval(async () => {
                    const currentUser = $auth.currentUser

                    if (!currentUser) {
                        return
                    }
                    
                    currentUser.reload()

                    //Check verification status
                    if (currentUser?.emailVerified) {
                        clearInterval(interval)

                        useAuthStore().updateUser(currentUser.email!, currentUser.emailVerified,
                            currentUser.displayName!, currentUser.photoURL!, currentUser.uid, true)

                        const idToken = await currentUser.getIdToken(true);
                        const {data: responseData} = await useFetch(`${config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl}/auth/login`, {
                            method: 'POST',
                            body: {
                                idToken: idToken,
                                subscription: null
                            },
                            credentials: 'include',
                        })

                        window.location.reload()
                    }
                }, 5000)

            } else {
                document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            }
        })
    }) 

    function handleLogout() {
        logoutUser()
        window.location.href = '/auth'
        // Delete the cookies named session and auth
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
</script>

<template>
    <div class="flex flex-row h-full items-center justify-start">

        <img src="/images/DogsHomeLogo-ReDesign%20(White&Final).png" alt="DogsHome logo" id="logo" class="md:visible invisible absolute w-[50px] h-[50px] top-[15px] left-[15px]">
        <img src="/images/DogsHomeLogo-ReDesign%20(Colorified&Final).png" alt="DogsHome logo" id="logo" class="visible md:invisible absolute w-[50px] h-[50px] top-[15px] right-[15px]">
        <a class="absolute hidden top-[15px] right-[15px] text-center text-[#ff3333] text-[16px] cursor-pointer" @click="logoutUser(); navigateTo('/auth')">Cerrar sesión</a>

        <svg class="max-h-screen h-screen w-[50px] md:w-[400px]" viewBox="0 0 320 1440" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Layer_1">
                <title>Layer 1</title>
                <g id="svg_1" transform="rotate(90, 159.909, 719.709)">
                <path id="svg_2" fill="#079292" d="m-560.09116,650.12319l80,25.42733c80,25.90484 240,76.04324 400,57.30103c160,-19.45847 320,-107.79756 480,-146.35638c160,-37.84255 320,-25.90484 400,-19.10034l80,6.32699l0,305.60548l-80,0c-80,0 -240,0 -400,0c-160,0 -320,0 -480,0c-160,0 -320,0 -400,0l-80,0l0,-229.20411z"></path>
            </g>
            </g>
        </svg>
        <div id="verification-container" class="w-full h-screen flex flex-col relative items-center justify-start pr-[15px] pl-[15px] pt-[50px] pb-[50px] box-border max-w-full">
            <div class="max-w-[500px] w-full flex flex-col justify-start items-center h-full">
                <h1 class="font-['lato'] font-extrabold text-[24pt] text-[#333] max-w-full w-[75vw] md:w-[50vw] m-0 text-center md:text-[32pt]">Verificación</h1>
                <p class="text-center">Te enviamos un correo de verificación a <b>{{ useAuthStore().user.email }}</b></p>
                <p @click="handleLogout" class="text-center">¿Este no es tú e-mail? <a class="text-primary cursor-pointer">Cambiálo</a></p>
                <div class="flex flex-col justify-start grow">
                    <!-- <button @click="handleSendVerificationEmail">Send Verification Email</button> -->
                    <!-- <LoadingAnimation id="loading" class="loading-shown" /> -->
                </div>
                <img src="/images/verification-sent.svg" alt="Ilustración representando un e-mail enviado exitosamente" class="max-w-[200px]">
                <div class="flex grow"></div>
                <p class="text-center">¿No encontrás el correo? Probá buscando en la carpeta de spam, o podemos <a @click="handleSendVerificationEmail" class="cursor-pointer text-primary" id="resend-btn">reenviarlo</a> <a id="resend-countdown" class="hidden">({{ getResendCountdownString() }})</a> </p>
            </div>
        </div>

        <a class="absolute bottom-[15px] right-[15px] font-['libel-suit-rg'] w-auto text-center text-primary text-[24px]">DogsHome</a>
    </div>
</template>

<style scoped>

</style>