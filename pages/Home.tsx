import React, {Fragment} from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as KakaoLogin from '@react-native-seoul/kakao-login';
import LoginService from '../api/Login/LoginServices';
import {
  setJwtToken,
  setUserStatus,
} from '../services/localStorage/localStorage';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './page.type';

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<RootStackParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const Home = () => {
  const socialLogin = new LoginService();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const signInWithKakao = async (): Promise<void> => {
    try {
      const result = await KakaoLogin.login();
      const response = await socialLogin.socialLogin({
        accessToken: result.accessToken,
        snsType: 'KAKAO',
      });
      const loginData = response.result;
      if (loginData) {
        setJwtToken(loginData.token);
        setUserStatus(loginData.userStatus);
        navigation.navigate('WebViewPage', {
          token: loginData.token,
          userStatus: loginData.userStatus,
        });
      }
    } catch (err) {
      console.error('login err', err);
    }
  };
  return (
    <Fragment>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <SafeAreaView style={S.container}>
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
                signInWithKakao();
              }}>
              <Image
                source={require('../assets/SocialLogin/google.png')}
                style={{width: 60, height: 60}}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const S = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  Layout: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  Info: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    top: 300,
    alignItems: 'center',
    width: '100%',
    height: '100%',
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
  Buttons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    bottom: 150,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  red: {
    color: 'red',
  },
});
export default Home;
