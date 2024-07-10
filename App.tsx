import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './pages/Home';
import WebViewPage from './pages/Webview';
import {RootStackParamList} from './pages/page.type';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {REACT_APP_GOOGLE_CI} from '@env';

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
