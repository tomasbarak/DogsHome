import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    //@ts-ignore
    const user = reactive({
        email: '',
        logged: false,
        email_verified: false,
        name: '',
        picture: '',
        uid: '',
    })

    function $reset() {
        user.email = ''
        user.logged = false
        user.email_verified = false
        user.name = ''
        user.picture = ''
        user.uid = ''
    }

    function updateUser(email: string, email_verified: boolean, name: string, picture: string, uid: string, logged: boolean) {
        user.email = email
        user.logged = logged
        user.email_verified = email_verified
        user.name = name
        user.picture = picture
        user.uid = uid
    }

    return {
        user,
        $reset,
        updateUser
    }
}, {persist: true})