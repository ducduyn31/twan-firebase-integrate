import {BaseFirestoreRepository, Collection, getRepository} from 'fireorm';

@Collection()
export class Auth2User {
    id: string;
    authId: string;
    userId: string;
}

class LinkAuthRepo {
    private _repository = undefined;

    get Repo(): BaseFirestoreRepository<Auth2User> {
        if (!this._repository) {
            this._repository = getRepository(Auth2User)
        }

        return this._repository;
    }
}

export const LinkAuthRepository = new LinkAuthRepo();

