export default defineNuxtRouteMiddleware(async (to, from) => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0"
    const ignoreRoutes = [
        '/profile/image', '/profile/image/'
    ]

    if(ignoreRoutes.includes(to.path)) return
    if(process.client) return

    const currentHostName =  useNuxtApp().ssrContext?.event.node.req.headers.host
    const sessionCookie = useCookie('session');
    const runtimeConfig = useRuntimeConfig()
    const apiUrl = runtimeConfig.public.context == "dev" ? runtimeConfig.public.dev.apiUrl : runtimeConfig.public.prod.apiUrl

    if(!sessionCookie.value) return;

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
    
    const authData = authRes!.data.value
    let profileData = {
        creationInstance: -1
    }
    try {
        profileData = await profileRes?.json()
    } catch (e) {
        console.log('error', e)
        profileData.creationInstance = -1;
    }

    useState('user', () => null)

    if(authData?.statusCode === 200){
        const claim: any = authData?.claim
        
        const creationState = useState('creationInstance');
        const profileState = useState('userProfile')

        creationState.value = profileData.creationInstance;
        profileState.value = profileData;

        if(profileData.creationInstance < 1 || profileData.creationInstance === undefined || profileData.creationInstance === null){
            const initProfile = await fetch(`${apiUrl}/user/profile/init`, {
                method: 'POST',
                headers: {
                    'Authorization': `${sessionCookie.value}`
                }
            })
        }

        if(to.path === '/auth'){
            return navigateTo('/home')
        }
        
        if(!claim.email_verified && to.path !== '/verification'){
            return navigateTo('/verification')
        }

        if (profileData.creationInstance < 9 && to.path !== '/setup' && to.path !== '/verification') {
            return navigateTo('/setup');
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