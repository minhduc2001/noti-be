import { Injectable } from '@nestjs/common';
import { getMessaging, MessagingTopicManagementResponse, TokenMessage, Messaging, MessagingPayload } from 'firebase-admin/messaging';

// CORE
import { NOTIFICATION_PLATFORM, NotifyTopic } from '../../enums/notyfication.enum';
import { App, getApp, ServiceAccount, } from 'firebase-admin/app';
import { SubTopicNotifyDto } from '../../dto/notification/notify.dto';
import { IFirebaseSendNotification, IFirebaseSendNotificationGroupDevices } from '../../interface/firebase-notification';
import * as firebase from 'firebase-admin';
import * as serviceAccount from '../../../../firebase.json'
import { InjectRepository } from '@nestjs/typeorm';
import { Firebase } from 'src/firebase/entities/firebase.entity';
import { Repository } from 'typeorm';

const request = require('request');

@Injectable()
export class FirebaseNotificationService {
  constructor(
    @InjectRepository(Firebase)
    private readonly repository: Repository<Firebase>
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount as ServiceAccount),
    }
    )
  }

  //   https://fcm.googleapis.com/fcm/notification
  // Content-Type:application/json
  // Authorization:key=API_KEY
  // project_id:SENDER_ID

  // {
  //    "operation": "create",
  //    "notification_key_name": "appUser-Chris",
  //    "registration_ids": ["bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
  //                         "cR1rjyj4_Kc:APA91bGusqbypSuMdsh7jSNrW4nzsM...",
  //                         ... ]



  async AddDeviceGroup(data: IFirebaseSendNotificationGroupDevices) {

    const options = {
      url: 'https://fcm.googleapis.com/fcm/notification',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'key=AAAA6JEZ2NE:APA91bFM5Ce7pKDtnM9lk1r9ie3YI9gm6TRr7WZCg4DevE8xEO5D-yD3d0O_asuerk2Ip_ziREsBVtVIIqucOiTXV9o62Mb0Da0i_6EI9C7ZcmFluREaqLUoCn9EdrctLaDTDhD58nJt',
        'project_id': '998866802897'
      },
      json: {
        operation: 'create',
        notification_key_name: data.notification_key_name,
        registration_ids: data.registrationTokens,
      }
    };
    request(options, (error, response, body) => {
      console.log(body, 'body');


      if (!error && response.statusCode === 200) {
        console.log(body);
      }
    })

  }

  async sendGroupDevice(data: IFirebaseSendNotificationGroupDevices) {
    const app = getApp();

    // {https://fcm.googleapis.com/fcm/notification
    // Content-Type:application/json
    // Authorization:key=API_KEY
    // project_id:SENDER_ID

    // {
    //    "operation": "create",
    //    "notification_key_name": "appUser-Chris",
    //    "registration_ids": ["bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
    //                         "cR1rjyj4_Kc:APA91bGusqbypSuMdsh7jSNrW4nzsM...",
    //                         ... ]
    // }

    const payload = {
      notification: {
          title: 'New message from John Doe',
          body: 'You have a new message from John Doe',
          icon: 'path/to/icon',
          click_action: '#'
      },
      data: {
          message_id: '123',
          sender_name: 'John Doe',
          sender_avatar: 'path/to/avatar',
          message_content: 'Hello, how are you?'
      }
  };
    // const payload: MessagingPayload = {
    //   notification: {
    //     title: 'Notification Title',
    //     body: 'Notification Body',
    //     icon: 'path/to/icon',
    //     click_action: 'path/to/action'
    //   },
    //   data: {
    //     key1: 'value1',
    //     key2: 'value2'
    //   }
    // };
    return getMessaging(app).sendToDeviceGroup(data.notification_key, payload);
  }


  async send(data: IFirebaseSendNotification) {
    const app = getApp();
    const payload = this.createPayload(data, [
      NOTIFICATION_PLATFORM.web,
      NOTIFICATION_PLATFORM.android,
      NOTIFICATION_PLATFORM.ios,
    ]);
    return getMessaging(app).send(payload);
  }

  private createPayload(data: IFirebaseSendNotification, platforms: NOTIFICATION_PLATFORM[]) {
    const payload: TokenMessage = {
      notification: {
        title: data.title,
        body: data.body,
      },
      token: data.token,
    };
    platforms.forEach((platform) => {
      switch (platform) {
        case NOTIFICATION_PLATFORM.web:
          payload.webpush = {
            data: {
              actionDetail: 'openDetail',
            },
          };
          break;
        case NOTIFICATION_PLATFORM.android:
          payload.android = {
            data: {
              actionDetail: 'openDetail',
            },
          };
          break;
        case NOTIFICATION_PLATFORM.ios:
          payload.apns = {
            fcmOptions: {
              imageUrl: data.title,
            },
            payload: {
              aps: {},
              actionDetail: 'openDetail',
            },
          };
          break;
      }
    });

    return payload;
  }

  async createNotificationKey(name: string, registrationTokens: string[]) {
    try {
      // getMessaging().sendToDeviceGroup() 
      // const key = await 
      // return key;
    } catch (e) {
      throw new Error('Error creating notification key');
    }
  }

  async subscribeTopic(subTopicNotifyDto: SubTopicNotifyDto) {
    const otherApp = getApp();
    return this._subscribeFireBaseTopic(otherApp, subTopicNotifyDto.tokenNotify, subTopicNotifyDto.topic);
  }

  async unsubscribeTopic(subTopicNotifyDto: SubTopicNotifyDto) {
    const otherApp = getApp();
    return this._unsubscribeFireBaseTopic(otherApp, subTopicNotifyDto.tokenNotify, subTopicNotifyDto.topic);
  }

  private async _subscribeFireBaseTopic(
    app: App,
    registrationTokenOrTokens: string | string[],
    topic: NotifyTopic,
  ): Promise<MessagingTopicManagementResponse> {
    const response = await getMessaging(app).subscribeToTopic(registrationTokenOrTokens, topic);
    if (response.failureCount > 0)
      console.log
        (
          'Firebase subscribe topic error',
          response.errors.map((ele) => ele.error.code),
        );

    return response;
  }

  private async _unsubscribeFireBaseTopic(
    app: App,
    registrationTokenOrTokens: string | string[],
    topic: NotifyTopic,
  ): Promise<MessagingTopicManagementResponse> {
    const response = await getMessaging(app).unsubscribeFromTopic(registrationTokenOrTokens, topic);
    if (response.failureCount > 0)
      console.log(
        'Firebase unsubscribe topic error',
        response.errors.map((ele) => ele.error.code),
      );

    return response;
  }
}
