export type RootStackParamList = {
  Home: undefined;
  WebViewPage: WebViewPropsType;
};

export type WebViewPropsType = {
  token: string;
  userStatus: string;
  url?: string;
};
