import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

export const Config = {
    KAFKA_BROKER: undefined,
    KAFKA_CREATE_USER_TOPIC: undefined,
    FIREBASE_DATABASE_URL: undefined,
    KAFKA_GET_USER: undefined,
};

export const configInitTrigger = new Subject<any>();

export const onConfigInitialized = (dependency, ...args) => configInitTrigger.pipe(map(() => {
    console.log(dependency(...args))
    return dependency(...args);
})).toPromise();
