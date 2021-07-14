import {Injectable} from '@nestjs/common';
import {UserCreateMessage} from './dto/create-user.message';
import * as admin from 'firebase-admin';
// @ts-ignore
import {LinkAuthRepository} from './dto/link-auth.collection';
// @ts-ignore
import {UserRepository} from './dto/user.collection';

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

    public async changePassword(username: string): Promise<any> {
        return admin.auth().generatePasswordResetLink(username);
    }
}
