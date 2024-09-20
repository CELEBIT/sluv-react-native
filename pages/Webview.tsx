import React, {useEffect, useRef, useState} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './page.type';
import {REACT_APP_WEB} from '@env';
import {View, BackHandler, ToastAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import * as ExpoImagePicker from 'expo-image-picker';
import {HomeScreenNavigationProp} from './Home';
import {removeKey, removeTokens} from '../services/localStorage/localStorage';
import LocalStorageKey from '../services/localStorage/localStorageKey';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

import pushNoti, {convertPushUrl} from '../utils/pushNoti';
// import RNFS from 'react-native-fs';

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
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {token, userStatus, url} = route.params;
  const [webviewUrl, setWebviewUrl] = useState(REACT_APP_WEB);

  const injectedJavaScript = `
    localStorage.setItem("accessToken", "${token}");
    localStorage.setItem("userStatus", "${userStatus}");
    true;
  `;

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log(remoteMessage);
  //     pushNoti.displayNoti(remoteMessage); // 위에서 작성한 함수로 넘겨준다
  //   });
  //   return unsubscribe;
  // }, []);

  useEffect(() => {
    // Foreground에서 메시지 수신
    const unsubscribeOnMessage = messaging().onMessage(remoteMessage => {
      console.log('Foreground message:', remoteMessage);
      // 알림 표시 (자신의 알림 표시 로직으로 변경)
      pushNoti.displayNoti(remoteMessage);
    });

    const unsubscribeOnNotificationOpenedApp =
      messaging().onNotificationOpenedApp(async remoteMessage => {
        const {data} = remoteMessage;
        console.log('Notification opened:', data);

        if (data) {
          setWebviewUrl(`${REACT_APP_WEB}${convertPushUrl(data)}`);
        }
      });

    return () => {
      unsubscribeOnMessage();
      unsubscribeOnNotificationOpenedApp();
    };
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  // const [selectedImage, setSelectedImage] = useState(null);
  const webViewRef = useRef<WebView>(null);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const {data} = event.nativeEvent;
    const message = JSON.parse(data);

    console.log('message', message);
    if (message.type === 'openGallery') {
      const result: any = [];
      ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: message.photosToSelect,
        quality: 1,
      }).then(async pickerResult => {
        if (pickerResult.assets) {
          for (const image of pickerResult.assets) {
            const croppedImage = await ImagePicker.openCropper({
              width: 600,
              height: 800,
              mediaType: 'photo',
              showCropFrame: true,
              path: image.uri,
              cropperActiveWidgetColor: '#6C47FF',
              includeBase64: true,
            });
            result.push(croppedImage.data);
          }
        }
        if (webViewRef.current) {
          webViewRef.current.postMessage(
            JSON.stringify({
              detail: result,
            }),
          );
        }
      });
    }
    if (message.type === 'logout') {
      console.log(message);
      removeKey(LocalStorageKey.JWT_TOKEN);
      removeKey(LocalStorageKey.UserStatus);
      navigation.navigate('Home');
    }
    if (message.type === 'withdraw') {
      console.log(message);
      removeTokens();
      navigation.navigate('Home');
    }
  };

  const [canGoBack, setCanGoBack] = useState<boolean>(false);

  const handleNavigationStateChange = (navState: any) => {
    if (canGoBack && navState.canGoBack === false) {
      showToastWithGravityAndOffset();
    }
    setCanGoBack(navState.canGoBack);
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      '한번 더 누르면 앱이 종료됩니다.',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  useEffect(() => {
    const handleBackPress = () => {
      if (canGoBack) {
        webViewRef.current?.goBack();
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{uri: webviewUrl}}
        injectedJavaScript={injectedJavaScript}
        style={{flex: 1}}
        scrollEnabled={false}
        onMessage={handleWebViewMessage}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

export default WebViewPage;
