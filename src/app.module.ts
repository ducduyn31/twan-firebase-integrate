import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {UserModule} from './user/user.module';
import {EtcdModule} from 'nestjs-etcd3';

@Module({
    imports: [EtcdModule.root({
        hosts: 'http://etcd:2379'
    })],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
