import { ISocialService, SoicalUser } from "./ISocialAuthService";
import { axiosKakaoToken, axiosKakaoInfo } from "../../api/axios";



export class KakaoService implements ISocialService {
    private readonly clientID: string = process.env.KAKAO_DEV_REST_API_KEY as string;
    private readonly redirectUri: string = process.env.KAKAO_DEV_REDIRECT_URI_PRO as string;
    private readonly clientSecret: string = process.env.KAKAO_DEV_CLIENT_SECRET as string;



    public async getAccessToken(code: string): Promise<string> {
        console.log('Redirect URI being used:', this.redirectUri);
        const response = await axiosKakaoToken.post('', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: this.clientID,
                redirect_uri: this.redirectUri,
                code: code,
                client_secret: this.clientSecret
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
        });
        console.log('Requesting access token with params:', {
            grant_type: 'authorization_code',
            client_id: this.clientID,
            redirect_uri: this.redirectUri,
            code: code,
            client_secret: this.clientSecret,
        });
        return response.data.access_token;
    }
    public async getUserInfo(accesssToken: string): Promise<SoicalUser> {
        console.log("액세스 토큰: ", accesssToken);
        const response = await axiosKakaoInfo.get('', {
            headers: {
                "Authorization": `Bearer ${accesssToken}`,
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        })
        const kakaoAccount = response.data.kakao_account;
        return {
            id: response.data.id,
            email: kakaoAccount.email,
            nickname: kakaoAccount.profile.nickname,
            profileImage: kakaoAccount.profile.profile_image_url,
            phone: kakaoAccount.phone_number
        }
    }

}

export default new KakaoService();