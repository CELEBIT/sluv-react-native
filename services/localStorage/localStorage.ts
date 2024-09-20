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
const getItemOrNull = async (key: LocalStorageKey): Promise<string | null> => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data ? data.replace(/"/g, '') : null;
  } catch (error) {
    console.log('localstorage error: ', error);
    return null;
  }
};

// JWT 토큰 저장
export const setJwtToken = async (token: string) => {
  await setItem<string>(LocalStorageKey.JWT_TOKEN, token);
};

// FCM 토큰 저장
export const setFCMToken = async (token: string) => {
  await setItem<string>(LocalStorageKey.FCM_TOKEN, token);
};

// FCM Data 저장
export const setFCMData = async (data: any) => {
  await setItem<string>(LocalStorageKey.FCM_DATA, data);
};

// UserStatus 저장
export const setUserStatus = async (UserStatus: string) => {
  await setItem<string>(LocalStorageKey.UserStatus, UserStatus);
};

// 로그인 방법 저장
export const setLoginMethod = async (value: string) => {
  await setItem<string>(LocalStorageKey.LoginMethod, value);
};

// JWT 토큰 값 꺼내기
export const getJwtToken = async (): Promise<string | null> => {
  return await getItemOrNull(LocalStorageKey.JWT_TOKEN);
};

// FCM 토큰 값 꺼내기
export const getFCMToken = async (): Promise<string | null> => {
  return await getItemOrNull(LocalStorageKey.FCM_TOKEN);
};

// UserStatus 값 꺼내기
export const getUserStatus = async (): Promise<string | null> => {
  const UserStatus = await getItemOrNull(LocalStorageKey.UserStatus);
  return UserStatus;
};

// 회원가입을 해야 할 최초 유저 여부 가져옴
export const getLoginMethod = async (): Promise<string> => {
  return (await getItemOrNull(LocalStorageKey.LoginMethod)) ?? '';
};

// 특정 키의 값만 삭제
export const removeKey = async (key: LocalStorageKey) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    console.error('localstorage error: ', error);
  }
};

// 로그아웃 혹은 탈퇴 토큰 제거
export const removeTokens = async () => {
  await EncryptedStorage.clear();
};
