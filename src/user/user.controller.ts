import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {KAFKA_CREATE_USER_TOPIC} from '../config';
import {KafkaMessage} from 'kafkajs';
import {UserCreateMessage} from './dto/create-user.message';
import {UserService} from './user.service';

@Controller()
export class UserController {

    constructor(private readonly userService: UserService) {
    }


    @MessagePattern(KAFKA_CREATE_USER_TOPIC)
    createNewUser( message: KafkaMessage): any {
        const userInfo: UserCreateMessage = message.value as unknown as UserCreateMessage;
        this.userService.createUser(userInfo);
    }
}
