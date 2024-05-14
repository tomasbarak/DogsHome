export default defineEventHandler( async ( event ) => {
    const config = useRuntimeConfig()
    const apiUrl = config.public.context == 'dev' ? config.public.dev.apiUrl : config.public.prod.apiUrl
    const filename = event.context.params!.filename

    try {
        const image = await fetch(`${apiUrl}/uploaded/profile/image/${filename}`)
        return image
    } catch (error) {
        console.log(error);
        return {
            statusCode: 401,
            image: null
        }
    }
})