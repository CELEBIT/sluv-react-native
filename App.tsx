import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './pages/Home';
import WebViewPage from './pages/Webview';
import {RootStackParamList} from './pages/page.type';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {REACT_APP_GOOGLE_CI} from '@env';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {convertPushUrl} from './utils/pushNoti';

const Stack = createNativeStackNavigator<RootStackParamList>();
// 백그라운드 및 종료 상태에서 알림 수신

const App: React.FC = () => {
  const [notificationUrl, setNotificationUrl] = useState<string>('');

  const googleSigninConfigure = () => {
    GoogleSignin.configure({
      offlineAccess: true,
      webClientId: REACT_APP_GOOGLE_CI,
      forceCodeForRefreshToken: true,
    });
  };
  useEffect(() => {
    googleSigninConfigure();
  }, []);

  async function requestNotificationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (notificationUrl && navigationRef.current) {
      // Home 스크린이 이미 마운트된 경우 파라미터 업데이트
      navigationRef.current?.navigate('Home', {notificationUrl});
    }
  }, [notificationUrl]);

  useLayoutEffect(() => {
    const setupNotifications = async () => {
      await messaging().registerDeviceForRemoteMessages();
      await notifee.requestPermission();

      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage) {
          console.log('🚀  messaging  remoteMessage:', remoteMessage);
          setNotificationUrl(convertPushUrl(remoteMessage.data));
        }
      });

      // 종료 상태에서 알림 클릭으로 앱이 열린 경우 처리
      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log(
              '🚀  messaging  remoteMessage:',
              convertPushUrl(remoteMessage.data),
            );
            setNotificationUrl(convertPushUrl(remoteMessage.data));
          }
        });
    };

    setupNotifications();
  }, []);
  const navigationRef = useRef<any>(null);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
          initialParams={{notificationUrl}}
        />
        <Stack.Screen
          name="WebViewPage"
          component={WebViewPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
