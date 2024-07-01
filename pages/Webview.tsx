import React, {useRef} from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from './page.type';
import {REACT_APP_WEB} from '@env';
import {View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import * as ExpoImagePicker from 'expo-image-picker';

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
  const {token, userStatus} = route.params;
  const injectedJavaScript = `
    localStorage.setItem("accessToken", "${token}");
    localStorage.setItem("userStatus", "${userStatus}");
    true;
  `;

  // const [selectedImage, setSelectedImage] = useState(null);
  const webViewRef = useRef<WebView>(null);

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    const {data} = event.nativeEvent;
    const message = JSON.parse(data);
    if (message.type === 'openGallery') {
      console.log(message);
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
  };
  return (
    <View style={{flex: 1}}>
      <WebView
        ref={webViewRef}
        source={{uri: REACT_APP_WEB}}
        injectedJavaScript={injectedJavaScript}
        style={{flex: 1}}
        scrollEnabled={false}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
};

export default WebViewPage;
