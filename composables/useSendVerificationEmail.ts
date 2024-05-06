import { createTransport } from 'nodemailer'
import { renderFile } from 'ejs'

export default function () {

    const sendVerificationEmail = async () => {
        return await useFetch('/api/verify/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        })
    }

    return {
        sendVerificationEmail
    }
}