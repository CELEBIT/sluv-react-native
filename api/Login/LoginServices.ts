import {getFCMToken} from '../../services/localStorage/localStorage';
import request from '../core';
import {ResponseType} from '../core/type';
import {SocialLoginBody, SocialLoginResult} from './LoginService.type';
import {REACT_APP_MAIN_APP_API} from '@env';

export default class LoginService {
  auth: string;
  constructor() {
    this.auth = 'app/auth/auto-login';
  }

  async socialLogin(data: SocialLoginBody) {
    const response = await fetch(
      `${REACT_APP_MAIN_APP_API}app/auth/social-login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    return response.json();
  }

  // async autoLogin() {
  //   const fcmToken = await getFCMToken();
  //   console.log('fcm in auto', fcmToken);
  //   const data: ResponseType<SocialLoginResult> = await request.post(
  //     `${this.auth}`,
  //     {fcm: fcmToken},
  //   );
  //   console.log('autoLogin', data);
  //   return data;
  // }
  async autoLogin() {
    try {
      const fcmToken = await getFCMToken();
      console.log('fcm in auto', fcmToken);
      const data: ResponseType<SocialLoginResult> = await request.post(
        `${this.auth}`,
        {fcm: fcmToken},
      );
      console.log('autoLogin', data);
      return data;
    } catch (error) {
      console.error('Error in autoLogin:', error);
      throw error;
    }
  }
}
