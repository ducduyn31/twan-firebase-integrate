import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {Config} from './config';
import {Logger, ValidationPipe} from '@nestjs/common';
import * as firebaseAccount from '../secrets/firebase-key.json';
import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import {EtcdService} from 'nestjs-etcd3';

const {FIREBASE_DATABASE_URL, KAFKA_BROKER} = Config;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    console.log(Reflect.ownKeys(app))
    console.log(Reflect.get(app, 'container')['modules'])


    const etcdService = app.get(EtcdService);
    etcdService.getClient().getAll().strings().then((config) => {
        Object.keys(Config).forEach(key => Config[key] = config[key]);
    }).then(() => {
        app.connectMicroservice({
            transport: Transport.KAFKA,
            options: {
                client: {
                    brokers: [KAFKA_BROKER]
                }
            }
        });
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: firebaseAccount.project_id,
                clientEmail: firebaseAccount.client_email,
                privateKey: firebaseAccount.private_key
            }),
            databaseURL: FIREBASE_DATABASE_URL,
        });

        fireorm.initialize(admin.firestore());
    });
    Object.keys(Config).forEach(key => etcdService.watch(key).subscribe(value => Config[key] = value));

    app.useGlobalPipes(new ValidationPipe());

    const logger = new Logger('FirebaseService');
    app.listen(3032);
}

bootstrap();
