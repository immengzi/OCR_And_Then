import {jwtVerify, SignJWT} from 'jose';
import {IUser, JwtPayload} from '@/lib/types';
import {usersRepository} from "@/server/repositories/users-repo";

export class JwtHelper {
    private static SECRET = new TextEncoder().encode(
        process.env.JWT_SECRET
    )

    private static ISSUER = 'TestpaperAuto';
    private static AUDIENCE = 'College student';

    static async signToken(payload: JwtPayload, expiresIn: string = '24h'): Promise<string> {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + (parseInt(expiresIn) * 60 * 60);

        try {
            return await new SignJWT({...payload})
                .setProtectedHeader({alg: 'HS256'})
                .setIssuedAt(iat)
                .setExpirationTime(exp)
                .setIssuer(this.ISSUER)
                .setAudience(this.AUDIENCE)
                .sign(this.SECRET)
        } catch (error) {
            console.error('JWT signing error:', error);
            throw new Error('Failed to generate token');
        }
    }

    static async verifyToken<T = JwtPayload>(token: string): Promise<T> {
        try {
            const {payload} = await jwtVerify(token, this.SECRET, {
                issuer: this.ISSUER,
                audience: this.AUDIENCE,
            })
            return payload as T;
        } catch (error) {
            console.error('JWT verification error:', error);
            throw new Error('Invalid token');
        }
    }

    static async generateAccessToken(user: IUser): Promise<string> {
        const payload: JwtPayload = {
            _id: user._id.toString(),
            role: user.role
        }
        return this.signToken(payload);
    }

    static async generateRefreshToken(userId: string): Promise<string> {
        const payload: JwtPayload = {
            _id: userId,
            role: 'User' // 默认为User角色
        }
        return this.signToken(payload, '7d');
    }

    // 用于刷新令牌的方法
    static async refreshAccessToken(refreshToken: string): Promise<string> {
        try {
            const payload = await this.verifyToken<JwtPayload>(refreshToken);
            if (!payload._id) {
                throw new Error('Invalid refresh token');
            }

            // 从数据库获取最新的用户信息
            const user = await usersRepository.findById(payload._id);
            if (!user) {
                throw new Error('User not found');
            }

            // 生成新的访问令牌,使用数据库中的最新角色信息
            return this.generateAccessToken({
                id: payload._id,
                ...payload
            } as IUser)
        } catch (error) {
            console.error('Token refresh error:', error);
            throw new Error('Failed to refresh token');
        }
    }
}