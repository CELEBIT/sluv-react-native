import React, {Fragment, useEffect, useState} from 'react';

import {
  // Alert,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import LoginService from '../api/Login/LoginServices';
import {REACT_APP_WEB} from '@env';
import {
  setJwtToken,
  setUserStatus,
  setLoginMethod,
  getLoginMethod,
  getJwtToken,
  getUserStatus,
  // setFCMData,
} from '../services/localStorage/localStorage';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './page.type';
import messaging from '@react-native-firebase/messaging';
import {convertPushUrl} from '../utils/pushNoti';

export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

let backgroundURL = '';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🚀 setBackgroundMessageHandler:', remoteMessage);
  if (remoteMessage?.data) {
    backgroundURL = `${REACT_APP_WEB}${convertPushUrl(remoteMessage)}`;
  }
});
const Home = () => {
  const socialLogin = new LoginService();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [recentMethod, setRecentMethod] = useState<string | null>(null);
  const [url, setUrl] = useState(backgroundURL ?? '');
  // Fcm 토큰
  async function getFCMToken() {
    const token = await messaging().getToken();
    console.log('fcm token : ', token);
    return token;
  }

  // 카카오 로그인
  const signInWithKakao = async (): Promise<void> => {
    try {
      const result = await KakaoLogin.login();
      console.log(result);
      const fcmToken = await getFCMToken();
      const response = await socialLogin.socialLogin({
        accessToken: result.accessToken,
        snsType: 'KAKAO',
        fcm: fcmToken,
      });
      const loginData = response.result;
      if (loginData) {
        setJwtToken(loginData.token);
        setUserStatus(loginData.userStatus);
        setLoginMethod('KAKAO');
        setRecentMethod('KAKAO');
        navigation.navigate('WebViewPage', {
          token: loginData.token,
          userStatus: loginData.userStatus,
          url: url ?? undefined,
        });
      }
    } catch (err) {
      // loginError();
      console.log(err);
    }
  };
  // 구글 로그인
  const signInWithGoogle = async (): Promise<void> => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // firebase 로그인 확인 및 GA용로그인 Start
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      await auth().signInWithCredential(googleCredential);
      //firebase 로그인 확인 및 GA용로그인 End

      // SLUV 회원가입
      try {
        const fcmToken = await getFCMToken();
        const data = {
          accessToken: userInfo.idToken ?? '',
          snsType: 'GOOGLE',
          fcm: fcmToken,
        };
        const response = await socialLogin.socialLogin(data);
        const loginData = response.result;
        if (loginData) {
          setJwtToken(loginData.token);
          setUserStatus(loginData.userStatus);
          setLoginMethod('GOOGLE');
          setRecentMethod('GOOGLE');
          navigation.navigate('WebViewPage', {
            token: loginData.token,
            userStatus: loginData.userStatus,
            url: url ?? undefined,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.error('Google login err', err);
    }
  };

  const autoLogin = async (): Promise<void> => {
    const response = await socialLogin.autoLogin();
    if (response.isSuccess) {
      const accessToken = await getJwtToken();
      const userStatus = await getUserStatus();
      if (accessToken !== null && userStatus !== null) {
        navigation.navigate('WebViewPage', {
          token: accessToken,
          userStatus: userStatus,
          url: url ?? undefined,
        });
      }
    }
  };

  useEffect(() => {
    const checkLoginMethod = async () => {
      const method = await getLoginMethod();
      if (method) {
        setRecentMethod(method);
        await autoLogin();
      }
    };

    checkLoginMethod();
  });

  return (
    <Fragment>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <SafeAreaView style={S.Container}>
        <View style={S.Layout}>
          <View style={S.Info}>
            <Image
              source={require('../assets/Logo/logo.png')}
              style={{width: 202, height: 80}}
            />
            <Text style={S.MainText}>셀럽 아이템 정보 집합소</Text>
            <Text style={S.SubText}>나누고 싶은 셀럽의 정보를</Text>
            <Text style={S.SubText}>우리만의 아지트에서!</Text>
          </View>
          <View style={S.BottomContainer}>
            {recentMethod === null ? (
              <View style={S.Bubble}>
                <Text style={S.BubbleText}>
                  SNS 계정으로 간편하게 가입해요!
                </Text>
                <View style={[S.Pointer, S.DefaultBubble]}>
                  <View style={S.PointerTriangle} />
                </View>
              </View>
            ) : (
              <View style={S.Bubble}>
                <Text style={S.BubbleText}>최근 사용한 로그인 방법이에요</Text>
                {recentMethod === 'KAKAO' ? (
                  <View style={[S.Pointer, S.KakaoBubble]}>
                    <View style={S.PointerTriangle} />
                  </View>
                ) : (
                  <View style={[S.Pointer, S.GoogleBubble]}>
                    <View style={S.PointerTriangle} />
                  </View>
                )}
              </View>
            )}
            <View style={S.Buttons}>
              <Pressable
                onPress={() => {
                  signInWithKakao();
                }}>
                <Image
                  source={require('../assets/SocialLogin/kakao.png')}
                  style={{width: 60, height: 60}}
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  signInWithGoogle();
                }}>
                <Image
                  source={require('../assets/SocialLogin/google.png')}
                  style={{width: 60, height: 60}}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const S = StyleSheet.create({
  Container: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  Layout: {
    // flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    paddingTop: 200,
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  Info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainText: {
    marginTop: 32,
    marginBottom: 16,
    fontFamily: 'Pretendard-SemiBold',
    fontSize: 18,
    lineHeight: 21.48,
    textAlign: 'center',
    color: '#212529',
  },
  SubText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 15,
    lineHeight: 21.48,
    textAlign: 'center',
    color: '#7B8894',
  },
  Bubble: {
    display: 'flex',
    position: 'relative',
    backgroundColor: '#6C47FF',
    borderRadius: 8,
    padding: 12,
    // top: 170,
  },
  DefaultBubble: {
    left: '24%',
  },
  KakaoBubble: {
    left: '13%',
  },
  GoogleBubble: {
    right: '13%',
  },
  Pointer: {
    position: 'absolute',
    bottom: -8,
  },
  PointerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: '#6C47FF',
  },
  BubbleText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 13,
    lineHeight: 15.51,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '400',
  },
  BottomContainer: {
    alignItems: 'center',
    gap: 20,
  },
  Buttons: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  red: {
    color: 'red',
  },
});
export default Home;
