export interface IUser {
    _id: string,
    email: string,
    username: string,
    hash: string,
    role: 'User' | 'Admin',
    createdAt: Date,
    updatedAt: Date,
    isDeleting?: boolean
}

export interface LoginData {
    email: string
    hash: string
}

export interface RegisterData {
    email: string
    username: string
    hash: string
}