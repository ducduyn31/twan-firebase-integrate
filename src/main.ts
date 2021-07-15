import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Transport} from '@nestjs/microservices';
import {Config} from './config';
import {Logger, ValidationPipe} from '@nestjs/common';
import * as firebaseAccount from '../secrets/firebase-key.json';
import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import {EtcdService} from 'nestjs-etcd3';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const etcdService = app.get(EtcdService);
    const config = await etcdService.getClient().getAll().strings();
    Object.keys(Config).forEach(key => Config[key] = config[key]);
    app.connectMicroservice({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [Config.KAFKA_BROKER]
            }
        }
    });

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: firebaseAccount.project_id,
            clientEmail: firebaseAccount.client_email,
            privateKey: firebaseAccount.private_key
        }),
        databaseURL: Config.FIREBASE_DATABASE_URL,
    });
    fireorm.initialize(admin.firestore());
    Object.keys(Config).forEach(key => etcdService.watch(key).subscribe(value => Config[key] = value));

    app.useGlobalPipes(new ValidationPipe());

    new Logger('InitScript', true).log('Fully initialized config, firebase and global modules');
    await app.listen(3032);
}

bootstrap();
