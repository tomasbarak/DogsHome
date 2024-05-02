export default defineNuxtRouteMiddleware(async (to, from) => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0"
    console.log("middleware auth.global.ts")
    const ignoreRoutes = [
        '/profile/image', '/profile/image/'
    ]

    if(ignoreRoutes.includes(to.path)) return
    if(process.client) return

    console.log('middleware auth.global.ts', to.path)

    const currentHostName =  useNuxtApp().ssrContext?.event.node.req.headers.host
    const sessionCookie = useCookie('session');
    const runtimeConfig = useRuntimeConfig()

    console.log(sessionCookie.value)

    if(!sessionCookie.value) return;

    let authRes = null
    let profileRes = null

    try {
        authRes = await useFetch('/api/checkauthstatus',{
            method: 'POST',
            body: JSON.stringify({sessionCookie: sessionCookie.value})
        })

        profileRes = await fetch(`${runtimeConfig.public.dev.apiUrl}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `${sessionCookie.value}`
            }
        })

    } catch (e) {
        console.log('error', e)
    }
    
    const authData = authRes!.data.value
    const profileData = profileRes?.json()

    useState('user', () => null)

    if(authData?.statusCode === 200){
        const claim: any = authData?.claim

        if(to.path === '/auth'){
            return navigateTo('/home')
        }
        
        if(!claim.email_verified && to.path !== '/verification'){
            return navigateTo('/verification')
        }

        if(claim.email_verified && to.path === '/verification'){
            return navigateTo('/home')
        }

        const isAuth = useState('isAuth');
        isAuth.value = true;
        const user = useState('user');
        user.value = authData?.claim;
    } else {
        const isAuth = useState('isAuth');
        isAuth.value = false;
        const user = useState('user');
        user.value = null;
    }
})