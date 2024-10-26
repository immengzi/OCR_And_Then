import {redirect} from 'next/navigation'
import {cookies} from 'next/headers'
import {JwtHelper} from "@/server/middleware/jwt";

async function getAuthStatus() {
    try {
        const token = cookies().get('accessToken')?.value
        if (!token) {
            return false
        }
        await JwtHelper.verifyToken(token)
        return true
    } catch (error) {
        console.error('Auth check error:', error)
        cookies().delete('accessToken')
        return false
    }
}

export default async function AuthLayout({children}: {
    children: React.ReactNode
}) {
    const isAuthenticated = await getAuthStatus()

    if (isAuthenticated) {
        redirect('/')
    }

    return (
        <div className="max-w-sm w-full gap-5 text-center">
            {children}
        </div>
    )
}