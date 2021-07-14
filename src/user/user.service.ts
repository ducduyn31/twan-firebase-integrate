import {Injectable} from '@nestjs/common';
import {UserCreateMessage} from './dto/create-user.message';
import * as admin from 'firebase-admin';
import {LinkAuthRepository} from './dto/link-auth.collection';
import {User, UserRepository} from './dto/user.collection';

@Injectable()
export class UserService {
    public async createUser(userRequest: UserCreateMessage): Promise<any> {
        const { userId, username, password } = userRequest;
        const createdAuth = await admin.auth().createUser({ email: username, password });

        const linkAuth = LinkAuthRepository.create({
            userId,
            authId: createdAuth.uid,
        });

        const createUser = UserRepository.update({
            id: userId,
            fireAuthId: [createdAuth.uid]
        });

        return await Promise.all([linkAuth, createUser]);
    }

    public async getUser(userId: string): Promise<User> {
        return await UserRepository.findById(userId);
    }

    public async changePassword(username: string): Promise<any> {
        return admin.auth().generatePasswordResetLink(username);
    }
}
