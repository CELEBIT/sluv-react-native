import React, {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './pages/Home';
import WebViewPage from './pages/Webview';
import {RootStackParamList} from './pages/page.type';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {REACT_APP_GOOGLE_CI} from '@env';
import notifee from '@notifee/react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
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

  async function createNotificationChannel() {
    await notifee.createChannel({
      id: '스럽',
      name: '스럽',
    });
  }

  useEffect(() => {
    requestNotificationPermission();
    createNotificationChannel();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
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
