/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// import messaging from '@react-native-firebase/messaging';
// import pushNoti from './utils/pushNoti';

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   pushNoti.displayNoti(remoteMessage);
// });

AppRegistry.registerComponent(appName, () => App);
