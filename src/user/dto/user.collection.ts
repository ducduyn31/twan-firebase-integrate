import {BaseFirestoreRepository, Collection, getRepository} from 'fireorm';

@Collection()
export class User {
    id: string;
    quota?: number;
    networks?: string[];
    fireAuthId?: string[];
}


class UserRepo {

    private _repository = undefined;

    get Repo(): BaseFirestoreRepository<User> {
        if (!this._repository) {
            this._repository = getRepository(User)
        }

        return this._repository;
    }
}

export const UserRepository = new UserRepo();
