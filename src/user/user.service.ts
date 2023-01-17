import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { FirebaseAuthService } from 'src/firebase';
import { FirebaseNotificationService } from 'src/firebase/service/notification/notification.service';
import { Repository } from 'typeorm';
import { Devices } from './device.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
        @InjectRepository(Devices)
        private readonly deviceRepository: Repository<Devices>,
        private readonly fireService: FirebaseNotificationService,
        private readonly authFirebase: FirebaseAuthService,
    ){

    }

    async login(body: any){
        if(!body.username || body.password){
            this.fireService.send({token: body.token, body: '', title: 'Dang nhap that bai'})
            throw new Error('loi dnag nhap')
        }
        const user = await this.repository.findOne({where: {username: body.username, password: body.password}})
        if(user){
            console.log(body);
            const device = await this.deviceRepository.findOne({where: {userId: user.id}});
            if(!device){
                await this.deviceRepository.save({userId: user.id, registerIds: [body.token]});
            }
            else {
                if(!device.registerIds.includes(body.token)){
                await this.deviceRepository.update({userId: user.id}, {registerIds: [...device.registerIds, body.token]})
            }}

            
            this.fireService.send({token: body.token, body: '', title: 'Dang nhap thanh cong'})
            return {
            ...user,
            }
        } 
        
        else throw new Error('loi dnag nhap')
    }

    async register(body: any){
        const user = await this.repository.findOne({where: {username: body.username}})
        if(user) throw new Error('loi dnag ki')
        return await this.repository.save({username: body.username, password: body.password})
    }

    async getToken(id: number){
        const token = await this.deviceRepository.findOne({where: {userId: id}});
        console.log(token);
        return token;

    }

    async addDeviceGroup(groupName: string){
        const token = await this.getToken(3);
        await this.fireService.AddDeviceGroup({notification_key_name: groupName, registrationTokens: token.registerIds })
        return;
    }

    async sendNotify(token: string){
        this.fireService.send({token: token, body: '', title: 'gui thong bao don'});
        return;
    }

    async sendGroupNotify(){
        const token = await this.getToken(3);
        this.fireService.sendGroupDevice({notification_key: 'APA91bGwLBz_doK2ifMk0b1Lng0SQPdKezdn8ocAzl_912RIyrPpAeEime8d3YcuY0vKUcFRXAVTeuQ9SJmPt8e0UQETUeeAcbJxn3DZHpMFQ5KylhXvteQr6meqY7-uWENg8cB3kShm'});
        return;
    }
}
