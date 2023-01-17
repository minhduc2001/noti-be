import { Injectable } from '@nestjs/common';
import { FirebaseAuthService } from './firebase';
import { FirebaseNotificationService } from './firebase/service/notification/notification.service';

@Injectable()
export class AppService {
  constructor(
    private readonly fireService: FirebaseNotificationService,
    private readonly authFirebase: FirebaseAuthService
  ){

  }
  
  async getHello(){
    try {
      await this.fireService.send({
        body: 'hello ae sfsfsd',
        title: 'tesst nesstjs vhfghjgjgjh1',
        token: 'dEKwj5u92INWUIm3FW8HAx:APA91bEqm2w9_tJ12JXv9AgqJtS2aOiIRtpmkJSMiyzKsXuW7NQm4YrC8xfyOOjb-7s24RVD4NEXEVfIT2EmQXwuJqhe0baS4XCM4GHFRHnNaJ6rYcbKBpDxTjVb-df_7uFF_ppIBZU1'
      });

    } catch (error) {
      console.log(error);
      
    }
  }

}
