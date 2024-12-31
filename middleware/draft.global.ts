import { validate as isValidUUID } from 'uuid'


export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.path.includes('/editar/borrador/') || to.path.includes('/crear/borrador')) {
        const id = to.params.id

        console.log('id', id)

        if (!id || typeof id !== 'string') {
            return abortNavigation()
        }

        if (!isValidUUID(id)) {
            return abortNavigation()
        }

        const runtimeConfig = useRuntimeConfig()
        const apiUrl = runtimeConfig.public.context == "dev" ? runtimeConfig.public.dev.apiUrl : runtimeConfig.public.prod.apiUrl
        
        const sessionCookie = useCookie('session')
        // if (!sessionCookie.value) {
        //     return abortNavigation()
        // }

        const draftReq = await fetch(`${apiUrl}/drafts/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `${sessionCookie.value}`
            }
        }) 
        
        console.log('draftReq', draftReq)

        if (draftReq.status === 404 || draftReq.status === 401) {
            return abortNavigation()
        }

        const draftRes = await draftReq.json()

        const draftData = useState('draftData')
        draftData.value = draftRes[0]

        console.log('draftData', draftData.value)
    }
})