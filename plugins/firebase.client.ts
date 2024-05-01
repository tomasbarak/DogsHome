import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { type Auth, getAuth } from "firebase/auth";

export default defineNuxtPlugin(nuxtApp => {
    const firebaseConfig = {
        apiKey: "AIzaSyA-WFc4p_XQHXdCk1kQZviucvtzD_kUl_Q",
        authDomain: "dogshome-6af88.firebaseapp.com",
        databaseURL: "https://dogshome-6af88-default-rtdb.firebaseio.com",
        projectId: "dogshome-6af88",
        storageBucket: "dogshome-6af88.appspot.com",
        messagingSenderId: "41412657640",
        appId: "1:41412657640:web:a82615bcd2aa558bb2e45d",
        measurementId: "G-VNN34TGQD9"
    };

    const app = initializeApp(firebaseConfig);

    // const analytics = getAnalytics(app);
    const auth: Auth = getAuth(app);

    nuxtApp.hooks.hook('app:mounted', () => {
        auth.onIdTokenChanged(async (user) => {
            if (user) {
                const token = await user.getIdToken();
                const res = await setServerSession(token);
            }
        });
    })


    nuxtApp.vueApp.provide('$auth', auth);
    nuxtApp.provide('$auth', auth);

    return {
        provide: {
            auth,
        }
    }
})

async function setServerSession(token: string) {
    const config = useRuntimeConfig()
    const {data: responseData} = await useFetch(`${config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl}/auth/login`, {
        method: 'POST',
        body: {
            idToken: token,
            subscription: null
        },
        credentials: 'include',
    })

    return responseData
}