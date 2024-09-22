export type RootStackParamList = {
  Home: {notificationUrl?: string};
  WebViewPage: WebViewPropsType;
};

export type WebViewPropsType = {
  token: string;
  userStatus: string;
  url?: string;
};
