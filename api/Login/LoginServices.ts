import request from '../core';
import {ResponseType} from '../core/type';
import {SocialLoginBody, SocialLoginResult} from './LoginService.type';
import {REACT_APP_MAIN_APP_API} from '@env';

export default class LoginService {
  auth: string;
  constructor() {
    this.auth = '/app/auth';
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

  async autoLogin() {
    const data: ResponseType<SocialLoginResult> = await request.get(
      `${this.auth}/auto-login`,
    );

    return data.result;
  }
}
