import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {EtcdModule} from 'nestjs-etcd3';
import {UserModule} from './user/user.module';

@Module({
    imports: [EtcdModule.root({
        hosts: 'http://etcd:2379'
    }), UserModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
