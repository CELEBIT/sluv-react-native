export interface SocialLoginBody {
  accessToken: String;
  snsType: String;
  fcm: String;
}

export interface SocialLoginResult {
  userStatus: String;
  fcm: String;
}
