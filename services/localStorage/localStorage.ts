import EncryptedStorage from 'react-native-encrypted-storage';
import LocalStorageKey from './localStorageKey';

// 스토리지에 아이템을 저장
const setItem = async <T>(key: LocalStorageKey, items: T) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.log('localstorage error: ', error);
    return null;
  }
};

// 스토리지에서 아이템을 가져옴
const getItemOrNull = async <T>(key: LocalStorageKey): Promise<T | null> => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.log('localstorage error: ', error);
    return null;
  }
};

// 카카오 토큰 스토리지에 저장
export const setKakaoToken = async (token: String) => {
  await setItem<String>(LocalStorageKey.KakaoAccessToken, token);
};

// JWT 토큰 스토리지에 저장
export const setJwtToken = async (token: String) => {
  await setItem<String>(LocalStorageKey.JWT_TOKEN, token);
};

// UserStatus 스토리지에 저장
export const setUserStatus = async (UserStatus: String) => {
  await setItem<String>(LocalStorageKey.UserStatus, UserStatus);
};

// 카카오 토큰 값 꺼내기
export const getKakaoToken = async (): Promise<String | null> => {
  const refresh = await getItemOrNull<String>(LocalStorageKey.KakaoAccessToken);
  return refresh;
};

// JWT 토큰 값 꺼내기
export const getJwtToken = async (): Promise<String | null> => {
  const jwtToken = await getItemOrNull<String>(LocalStorageKey.JWT_TOKEN);
  return jwtToken;
};

// UserStatus 값 꺼내기
export const getUserStatus = async (): Promise<String | null> => {
  const UserStatus = await getItemOrNull<String>(LocalStorageKey.UserStatus);
  return UserStatus;
};

// 두개 동시에 저장
export const setTokens = async (refresh: String, access: String) => {
  await setKakaoToken(refresh);
  await setJwtToken(access);
};

// 로그아웃 혹은 탈퇴 토큰 제거
export const removeTokens = async () => {
  await EncryptedStorage.clear();
};

// 회원가입을 해야 할 최초 유저 여부 가져옴
export const getLoginWith = async (): Promise<String> => {
  return (await getItemOrNull<String>(LocalStorageKey.LoginWith)) ?? '';
};

// 최초 유저 여부 저장
export const setLoginWith = async (value: String) => {
  await setItem<String>(LocalStorageKey.LoginWith, value);
};
