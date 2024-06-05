export interface SocialLoginBody {
  accessToken: String;
  snsType: String;
}

export interface SocialLoginResult {
  token: String;
  userStatus: String;
}
