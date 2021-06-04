import {Collection, getRepository} from 'fireorm';

@Collection()
export class User {
    id: string;
    quota?: number;
    networks?: string[];
    fireAuthId?: string[];
}

export const UserRepository = getRepository(User);
