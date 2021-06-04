import {Collection, getRepository} from 'fireorm';

@Collection()
export class Auth2User {
    id: string;
    authId: string;
    userId: string;
}

export const LinkAuthRepository = getRepository(Auth2User);

