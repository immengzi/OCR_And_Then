import {User} from '@/server/db/models';
import {IUser, RegisterData} from '@/lib/types';
import {AppError} from "@/lib/types/errors";
import bcrypt from "bcrypt";

export class UsersRepository {
    async create(userData: RegisterData & { role: 'Admin' | 'User' }): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.deleteOne({_id: id});
        return result.deletedCount > 0;
    }

    async update(id: string, params: any): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, params, {new: true});
    }

    async findAll(): Promise<IUser[]> {
        return User.find();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({email});
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async updateUsername(userId: string, newUsername: string): Promise<IUser | null> {
        const existingUser = await User.findOne({
            username: newUsername,
            _id: {$ne: userId}
        });

        if (existingUser) {
            throw AppError.BadRequest('Username already taken');
        }

        return User.findByIdAndUpdate(
            userId,
            {username: newUsername},
            {new: true}
        );
    }

    async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<IUser | null> {
        const user = await this.findById(userId);
        if (!user) {
            throw AppError.NotFound('User not found');
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.hash);
        if (!isPasswordValid) {
            throw AppError.BadRequest('Current password is incorrect');
        }

        const saltRounds = 10;
        const newHash = await bcrypt.hash(newPassword, saltRounds);

        return User.findByIdAndUpdate(
            userId,
            {hash: newHash},
            {new: true}
        );
    }
}

export const usersRepository = new UsersRepository();