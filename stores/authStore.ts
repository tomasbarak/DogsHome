import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    //@ts-ignore
    const user = reactive({
        email: '',
        email_verified: false,
        name: '',
        picture: '',
        uid: ''
    })

    function $reset() {
        user.email = ''
        user.email_verified = false
        user.name = ''
        user.picture = ''
        user.uid = ''
    }

    function updateUser(email: string, email_verified: boolean, name: string, picture: string, uid: string) {
        user.email = email
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