import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from '@nestjs/microservices';
import {Config} from './config';
import {Logger, ValidationPipe} from '@nestjs/common';
import firebaseAccount from '../secrets/firebase-key.json';
import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import {EtcdService} from 'nestjs-etcd3';

const {FIREBASE_DATABASE_URL, KAFKA_BROKER} = Config;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [KAFKA_BROKER]
      }
    }
  });

  const etcdService = app.get(EtcdService);
  Object.keys(Config).forEach(key => etcdService.watch(key).subscribe(value => Config[key] = value));

  admin.initializeApp({
    credential: admin.credential.cert(firebaseAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });

  fireorm.initialize(admin.firestore());

  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger('FirebaseService');
  app.listen(() => logger.log('Started successfully'));
}
bootstrap();
