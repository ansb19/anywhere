import { ISocialService, SoicalUser, Token } from "./i-social-auth.service";
import { axiosKapi, axiosKauth } from "../../api/axios-client";


// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#kakaologin

export class KakaoService implements ISocialService {

    //나중에 바꿔야함
    private readonly clientID: string = process.env.NODE_ENV === "prdouction"
        ? process.env.KAKAO_REST_API_KEY as string
        : process.env.KAKAO_TEST_REST_API_KEY as string;

    private readonly redirectUri: string = process.env.NODE_ENV === "prdouction"
        ? process.env.NODE_NETWORK === "remote"
            ? process.env.KAKAO_REDIRECT_URI_REMOTE as string
            : process.env.KAKAO_REDIRECT_URI_LOCAL as string
        : process.env.NODE_NETWORK === "remote"
            ? process.env.KAKAO_TEST_REDIRECT_URI_REMOTE as string
            : process.env.KAKAO_TEST_REDIRECT_URI_LOCAL as string;


    private readonly clientSecret: string = process.env.NODE_ENV === "prdouction"
        ? process.env.KAKAO_CLIENT_SECRET as string
        : process.env.KAKAO_TEST_CLIENT_SECRET as string;
        
    private readonly front_url: string = process.env.FRONT_END_API as string;

    public get_url(): string {
        const loginUrl =
            `https://kauth.kakao.com/oauth/authorize?client_id=${this.clientID}&redirect_uri=${this.redirectUri}&response_type=code`;

        return loginUrl;
    }

    //토큰 요청
    public async request_token(code: string): Promise<Token> {

        const response = await axiosKauth.post('/oauth/token', {
            params: {
                grant_type: 'authorization_code',
                client_id: this.clientID,
                redirect_uri: this.redirectUri,
                code: code,
                client_secret: this.clientSecret
            },
        });
        console.log(response.data);
        return response.data; //액세스 토큰만 넘김.
        // {
        //     "token_type":"bearer",
        //     "access_token":"${ACCESS_TOKEN}",
        //     "expires_in":43199,
        //     "refresh_token":"${REFRESH_TOKEN}",
        //     "refresh_token_expires_in":5184000,
        //     "scope":"account_email profile"
        // }
    }

    //사용자 액세스 토큰과 리프레시 토큰을 모두 만료
    public async logout(access_token: string): Promise<string> {

        const response = await axiosKapi.post('/v1/user/logout', {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        return response.data.id;
    }

    //카카오계정과 함께 로그아웃
    public async logout_kakao_account(): Promise<void> {
        const response = await axiosKauth.get('/oauth/logout', {
            params: {
                client_id: this.clientID,
                logout_redirect_uri: this.front_url,

            }
        })
        console.log(response);
    }

    //연결 끊기
    public async unlink(access_token: string): Promise<string> {
        const response = await axiosKapi.post('/v1/user/unlink', {
            hearders: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        return response.data.id;
    }

    //토큰 정보 보기
    public async get_token_info(access_token: string): Promise<string> {
        const response = await axiosKapi.get('/v1/user/access_token_info', {
            headers: {
                "Authorization": `Bearer ${access_token}`,
            }
        })
        return response.data.id;
    }
    //토큰 갱신하기
    public async refresh_token(refresh_token: string): Promise<Token> {
        const response = await axiosKauth.post('/oauth/token', {
            params: {
                grant_type: 'refresh_token',
                client_id: this.clientID,
                refresh_token: refresh_token,
                client_secret: this.clientSecret,
            }
        })
        return response.data;
        // {
        //     "access_token":"${ACCESS_TOKEN}",
        //     "token_type":"bearer",
        //     "refresh_token":"${REFRESH_TOKEN}",  //optional
        //     "refresh_token_expires_in":5184000,  //optional
        //     "expires_in":43199,
        // }
    }

    // 사용자 정보 가져오기
    // https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info

    public async request_user_info(access_token: string): Promise<SoicalUser> {
        console.log("액세스 토큰: ", access_token);
        const response = await axiosKauth.post('/v2/user/me', {
            headers: {
                "Authorization": `Bearer ${access_token}`,
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
