import { useAuthStore } from '@/stores/authStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0"
    const ignoreRoutes = [
        '/profile/image', '/profile/image/'
    ]

    const protectedRoutes = [
        '/perfil',
        '/profile',
        // '/editar',
        // '/edit'
    ]

    if(ignoreRoutes.includes(to.path)) return
    if(process.client) return

    const currentHostName =  useNuxtApp().ssrContext?.event.node.req.headers.host
    const sessionCookie = useCookie('session');
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.context == "dev" ? runtimeConfig.public.dev.apiUrl : runtimeConfig.public.prod.apiUrl

    if(!sessionCookie.value) {
        const isProtected = protectedRoutes.some(route => to.path.includes(route))
        if(isProtected){
            // return navigateTo('/auth')
        }
        console.log('no session cookie')
        return
    };

    let authRes = null
    let profileRes = null

    try {
        authRes = await useFetch('/api/checkauthstatus',{
            method: 'POST',
            body: JSON.stringify({sessionCookie: sessionCookie.value})
        })

        profileRes = await fetch(`${apiUrl}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `${sessionCookie.value}`
            }
        })

    } catch (e) {
        console.log('error', e)
    }
    
    const authData: any = authRes!.data.value
    let profileData = {
        creation_instance: -1
    }
    try {
        profileData = await profileRes?.json()
    } catch (e) {
        console.log('error', e)
        profileData.creation_instance = -1;
    }

    useState('user', () => null)

    if(authData?.statusCode === 200){
        const claim: any = authData?.claim
        
        const creationState = useState('creationInstance');
        const profileState = useState('userProfile')

        
        if(profileData.creation_instance < 1 || profileData.creation_instance === undefined || profileData.creation_instance === null){
            const initProfile = await fetch(`${apiUrl}/user/profile/init`, {
                method: 'POST',
                headers: {
                    'Authorization': `${sessionCookie.value}`
                }
            })
            
            profileData.creation_instance = 1;
        }
        
        creationState.value = profileData.creation_instance;
        profileState.value = profileData;
        
        if(to.path === '/auth'){
            return navigateTo('/home')
        }
        
        if(!claim.email_verified && to.path !== '/verification'){
            return navigateTo('/verification')
        }

        if (profileData.creation_instance <= 9 && to.path !== '/setup' && to.path !== '/verification') {
            return navigateTo('/setup');
        }

        if (to.path == '/setup' && profileData.creation_instance > 9) {
            return navigateTo('/home');
        }

        if(claim.email_verified && to.path === '/verification'){
            return navigateTo('/home')
        }

        const isAuth = useState('isAuth');
        isAuth.value = true;
        const user = useState('user');
        user.value = authData?.claim;
    } else {

        // Check if to.path is inside of each route that requires authentication
        // Example: /perfil/lista/borradores -> /perfil = true
        


        const isAuth = useState('isAuth');
        isAuth.value = false;
        const user = useState('user');
        user.value = null;
    }
})