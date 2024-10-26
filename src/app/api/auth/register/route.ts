import {NextRequest} from 'next/server'
import bcrypt from 'bcrypt'
import {ApiResponseHandler} from '@/server/middleware/api-handler'
import {validateRequest} from '@/server/middleware/validate'
import {usersRepository} from '@/server/repositories/users-repo'
import {RegisterSchema} from '@/lib/config/auth'

export async function POST(request: NextRequest) {
    const validationResult = await validateRequest(RegisterSchema)(request)
    if (!validationResult.success) {
        return validationResult.error
    }

    const {email, username, password} = validationResult.data

    try {
        const existingUser = await usersRepository.findByEmail(email)
        if (existingUser) {
            return ApiResponseHandler.error(
                'Email already registered',
                400,
                'EMAIL_EXISTS'
            )
        }

        const allUsers = await usersRepository.findAll()
        const role = allUsers.length === 0 ? 'Admin' : 'User'

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await usersRepository.create({
            email,
            username,
            hash: hashedPassword,
            role
        })

        return ApiResponseHandler.success(
            {
                message: 'Registration successful',
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                    createdAt: user.createdAt
                }
            },
            201
        )

    } catch (error) {
        console.error('Registration error:', error)
        return ApiResponseHandler.serverError(error as Error)
    }
}