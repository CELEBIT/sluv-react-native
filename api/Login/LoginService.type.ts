export interface SocialLoginBody {
  accessToken: String;
  snsType: String;
  fcm: String;
}

export interface SocialLoginResult {
  token: String;
  userStatus: String;
}
