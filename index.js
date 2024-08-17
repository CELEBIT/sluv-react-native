/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

// Foreground에서 알림 수신
messaging().onMessage(async remoteMessage => {
  console.log('푸시 알림:', remoteMessage);
  await displayNotification(remoteMessage);
});

// 백그라운드 및 종료 상태에서 알림 수신
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('백그라운드에서 푸시 알림:', remoteMessage);
  // await displayNotification(remoteMessage);
});

async function displayNotification(remoteMessage) {
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      channelId: '스럽', // 채널 ID 설정
      smallIcon: 'ic_launcher', // 아이콘 설정
      pressAction: {
        id: '스럽',
      },
    },
  });
}
AppRegistry.registerComponent(appName, () => App);
