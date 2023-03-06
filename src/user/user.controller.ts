import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly service: UserService,
        //  private readonly 
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        return this.service.login(body);
    }

    @Get('test')
    async test(){
        return 'tests ok';
    }

    @Post('register')
    async register(@Body() body: any) {

        return this.service.register(body);
    }

    @Get(':id/token')
    async getToken(@Param() param: any) {
        return this.service.getToken(param.id)
    }

    @Post('add')
    async addDeviceGroup(@Body() body: any) {
        console.log(body);

        return this.service.addDeviceGroup(body.groupName)
    }


    @Post('send-group-noti')
    async sendGroupDevice(@Body() body: any) {
        return this.service.sendGroupNotify();
    }

    @Get('send-boardcast')
    async sendBoardcast(){
        
    }
}
