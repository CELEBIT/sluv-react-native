import React from 'react';
import {WebView} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './page.type';
import {REACT_APP_WEB} from '@env';

type WebViewPageRouteProp = RouteProp<RootStackParamList, 'WebViewPage'>;
type WebViewPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WebViewPage'
>;

type Props = {
  route: WebViewPageRouteProp;
  navigation: WebViewPageNavigationProp;
};

const WebViewPage: React.FC<Props> = ({route}) => {
  const {token, userStatus} = route.params;
  const injectedJavaScript = `
    localStorage.setItem("accessToken", "${token}");
    localStorage.setItem("userStatus", "${userStatus}");
    true;
  `;

  return (
    <WebView
      source={{uri: REACT_APP_WEB}}
      injectedJavaScript={injectedJavaScript}
      style={{flex: 1}}
      // Scroll을 비활성화하는 스타일 추가
      scrollEnabled={false}
    />
  );
};

export default WebViewPage;
