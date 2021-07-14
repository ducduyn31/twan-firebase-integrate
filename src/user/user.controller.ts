import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';

import {Config} from '../config';
import {KafkaMessage} from 'kafkajs';
import {UserCreateMessage} from './dto/create-user.message';
import {UserService} from './user.service';
import {User} from './dto/user.collection';

const {KAFKA_CREATE_USER_TOPIC, KAFKA_GET_USER} = Config;

@Controller()
export class UserController {

    constructor(private readonly userService: UserService) {
    }


    @MessagePattern(KAFKA_CREATE_USER_TOPIC)
    createNewUser( message: KafkaMessage): any {
        const userInfo: UserCreateMessage = message.value as unknown as UserCreateMessage;
        this.userService.createUser(userInfo);
    }

    @MessagePattern(KAFKA_GET_USER)
    async getUser(message: KafkaMessage): Promise<User> {
        const userId: string = message.value as unknown as string;

        return await this.userService.getUser(userId);
    }
}
