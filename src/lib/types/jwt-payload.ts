export interface JwtPayload {
    _id: string;
    role: 'User' | 'Admin';
}