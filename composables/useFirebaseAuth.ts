import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { useAuthStore } from '@/stores/authStore'
import { RefSymbol } from "@vue/reactivity";
import Cookies from 'js-cookie';

export default function() {
    const { $auth } = useNuxtApp();
    const authStore = useAuthStore();
    const user = useState<User | null>("fb_user", () => null);
    const config = useRuntimeConfig()

    useNuxtApp().hooks.hook('app:mounted', () => {
        $auth.onAuthStateChanged((user) => {
            console.log("Auth State Changed")

            if (user) {
                authStore.updateUser(user.email!, user.emailVerified, user.displayName!, user.photoURL!, user.uid, true)
                useState("fb_user", () => user);
            } else {
                authStore.$reset();
                useState("fb_user", () => null);
            }
        });
    })
    const registerUser = async (email: string, password: string): Promise<any> => {
        try {
            const userCreds = await createUserWithEmailAndPassword($auth, email, password);
            if ( userCreds ) {
                user.value = userCreds.user;

                authStore.updateUser(user.value.email!, user.value.emailVerified, user.value.displayName!, user.value.photoURL!, user.value.uid, true)

                return {success: true, user: userCreds.user};
            }
        } catch (error) {
            console.log(error);
            return {success: false, error: error}
        }
        return {success: false, error: "Unknown error"}
    }

    const loginUser = async (email: string, password: string): Promise<any> => {
        try {
            const userCreds = await signInWithEmailAndPassword($auth, email, password);
            if ( userCreds ) {
                user.value = userCreds.user;

                authStore.updateUser(user.value.email!, user.value.emailVerified, user.value.displayName!, user.value.photoURL!, user.value.uid, true)
                return {success: true, user: userCreds.user};
            }
        } catch (error) {
            console.log(error);
            return {success: false, error: error};
        }
        return {success: false, error: "Unknown error"};
    }

    const logoutUser = async (): Promise<any> => {
        try {
            await signOut($auth);
            user.value = null;
            authStore.$reset();
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=dogshome.com.ar";
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.dogshome.com.ar";
            return {success: true};
        } catch (error) {
            console.log(error);
            return {success: false, error: error};
        }
    }

    return {
        user,
        registerUser,
        loginUser,
        logoutUser,
    }
}