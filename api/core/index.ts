import axios, {AxiosError, AxiosInstance} from 'axios';
import {getJwtToken} from '../../services/localStorage/localStorage';
import {REACT_APP_MAIN_APP_API} from '@env';

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
    console.log('accessToken', accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // 요청 실패 시 처리
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  },
);

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
