import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { getApp, App, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { plainToClass } from 'class-transformer';
import { isInstance, validateOrReject } from 'class-validator';
import * as serviceAccount from '../../../../firebase.json'

// CORE

import { LoginFireBaseAuthDto, LoginGoogleDto } from '../../dto/auth/auth.dto';
import { IFirebaseDecoded } from '../../interface/auth.interface';

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const randomAlphabet = (stringLength: number) => {
  let randomString = '';

  const rd = () => {
    let rd = random(65, 122);
    if (90 < rd && rd < 97) rd += 10;
    return rd;
  };

  while (stringLength--) randomString += String.fromCharCode(rd());
  return randomString;
};


export function unidecode(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

@Injectable()
export class FirebaseAuthService {
  constructor() {
    // firebase.initializeApp({
    //   credential: firebase.credential.cert(serviceAccount as ServiceAccount)
    // })
    // initializeApp(firebaseConfig);
  }


  async verifyIdTokenFirebase(loginFireBaseAuthDto: LoginFireBaseAuthDto){
    try {
      const app: App = getApp();
      const decoded: firebase.auth.DecodedIdToken = await firebase
        .auth(app)
        .verifyIdToken(loginFireBaseAuthDto.idToken);
      if (!decoded) throw new Error('Firebase token is wrong or expired');

      if (!decoded.email) {
        const user = await firebase.auth(app).getUser(decoded.uid);
        decoded.email = user.email ?? user.providerData[0].email;
      }

      const registerDto = {
        email: decoded.email,
        username: decoded.name && unidecode(decoded.name).padEnd(5, randomAlphabet(5)),
        avatar: decoded.picture,
        socialId: decoded.uid,
      };

      await validateOrReject(plainToClass(LoginGoogleDto, registerDto), {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      return registerDto;
    } catch (e) {
      console.log(e, 'sjdgsjh');
      throw new Error('Firebase token is wrong or expired 111');
    }
  }
}
