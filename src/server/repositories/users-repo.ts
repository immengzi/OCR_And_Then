import {User} from '@/server/db/models'
import {IUser, RegisterData} from '@/lib/types'

export class UsersRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({email})
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id)
    }

    async create(userData: RegisterData & { role: 'Admin' | 'User' }): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async update(id: string, params: any): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, params, {new: true});
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.deleteOne({_id: id})
        return result.deletedCount > 0
    }

    async findAll(): Promise<IUser[]> {
        return User.find()
    }
}

export const usersRepository = new UsersRepository()