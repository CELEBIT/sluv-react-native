import axios, {AxiosInstance} from 'axios';
import {getJwtToken} from '../../services/localStorage/localStorage';
import {REACT_APP_MAIN_APP_API} from '@env';
// import * as jsonwebtoken from 'jsonwebtoken'
// import { JwtPayload } from 'jsonwebtoken'

// type BaseResponse<T = any> = {
//   isSuccess: boolean
//   message: string
//   result: T
// }

// axios 인스턴스
const request: AxiosInstance = axios.create({
  baseURL: REACT_APP_MAIN_APP_API,
  timeout: 2500,
});

// 요청 인터셉터
request.interceptors.request.use(
  async config => {
    // 요청 성공 직전 호출됨
    const accessToken = await getJwtToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  },
);

// // 요청 인터셉터
// request.interceptors.request.use(
//   (config) => {
//     // 요청 성공 직전 호출됨
//     const jwt = window.localStorage.getItem(JWT_KEY) ?? ''
//     const decodedJwt: JwtPayload = jsonwebtoken.decode(jwt) as JwtPayload
//     const currentTime = new Date().getTime() / 1000

//     if (decodedJwt.exp ?? 0 < currentTime) {
//       // 서버에 토큰 재발급 요청 코드 작성 필요
//       console.log('서버에 토큰 재발급 요청')
//     }
//     return config
//   },
//   (error) => {
//     console.log(error)
//     return Promise.reject(error)
//   },
// )

// 응답 인터셉터
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  },
);

export default request;
