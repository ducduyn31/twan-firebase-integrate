import {Module, OnModuleInit} from '@nestjs/common';
import {AppController} from './app.controller';
import {UserModule} from './user/user.module';
import {EtcdModule} from 'nestjs-etcd3';

@Module({
    imports: [EtcdModule.root({
        hosts: 'http://etcd:2379'
    }), UserModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements OnModuleInit {
    onModuleInit(): any {
        console.log('test')
    }
}
