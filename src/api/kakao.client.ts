import { Inject, Service } from "typedi";
import { axiosKapi, axiosKauth } from "./axios.client";
import { ISocialClient, SoicalUser, Token } from "./i-social.client";
import { EnvConfig } from "@/config/env-config";
import { ExternalApiError } from "@/common/exceptions/app.errors";
import { logger } from "@/common/utils/logger";

// https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#kakaologin

@Service()
export class KakaoClient implements ISocialClient {
    private readonly clientID: string;
    private readonly redirectUri: string;
    private readonly clientSecret: string;
    private readonly front_url: string;
    constructor(@Inject(() => EnvConfig) private readonly config: EnvConfig,
    ) {

        this.clientID = this.config.NODE_ENV === "production"
            ? this.config.KAKAO_REST_API_KEY
            : this.config.KAKAO_TEST_REST_API_KEY;

        this.redirectUri = this.config.NODE_ENV === "production"
            ? this.config.NODE_NETWORK === "remote"
                ? this.config.KAKAO_REDIRECT_URI_REMOTE
                : this.config.KAKAO_REDIRECT_URI_LOCAL
            : this.config.NODE_NETWORK === "remote"
                ? this.config.KAKAO_TEST_REDIRECT_URI_REMOTE
                : this.config.KAKAO_TEST_REDIRECT_URI_LOCAL;


        this.clientSecret = this.config.NODE_ENV === "production"
            ? this.config.KAKAO_CLIENT_SECRET
            : this.config.KAKAO_TEST_CLIENT_SECRET;

        this.front_url = this.config.FRONT_END_API;

        logger.info("KakaoClient initialized successfully", {
            clientID: this.clientID,
            redirectUri: this.redirectUri,
        });
    }

    public get_url(): string {
        const loginUrl =
            `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${this.clientID}&redirect_uri=${this.redirectUri}`;
        logger.info(`Generated Kakao login URL: ${loginUrl}`);
        return loginUrl;
    }

    //토큰 요청
    public async request_token(code: string): Promise<Token> {
        try {
            logger.info("Requesting Kakao token...");
            const response = await axiosKauth.post('/oauth/token', {
                grant_type: "authorization_code",
                client_id: this.clientID,
                redirect_uri: this.redirectUri,
                code: code,
                client_secret: this.clientSecret
            },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                });
            logger.info("Kakao token request successful.");
            return {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in,
                refresh_token_expires_in: response.data.refresh_token_expires_in
            };
        } catch (error) {
            throw new ExternalApiError("카카오 토큰 요청 중 오류 발생", error as Error);
        }

        //액세스 토큰만 넘김.
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
        try {
            logger.info("Logging out user via Kakao...");
            const response = await axiosKapi.post('/v1/user/logout', null, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            logger.info("Kakao logout successful.");
            return response.data.id;
        } catch (error) {
            throw new ExternalApiError("카카오 로그아웃 요청 중 오류 발생", error as Error);
        }
    }

    //카카오계정과 함께 로그아웃
    public async logout_kakao_account(): Promise<void> {
        logger.info("Logging out user via Kakao account...");
        try {
            const response = await axiosKauth.get('/oauth/logout', {
                params: {
                    client_id: this.clientID,
                    logout_redirect_uri: this.front_url,

                }
            })
            logger.info("Kakao account logout successful");
        } catch (error) {
            throw new ExternalApiError("카카오 계정 로그아웃 요청 중 오류 발생", error as Error);
        }
    }

    //연결 끊기
    public async unlink(access_token: string): Promise<string> {
        logger.info("Unlinking user from Kakao...");
        try {
            const response = await axiosKapi.post('/v1/user/unlink', null, {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                }
            })
            logger.info("Kakao unlink successful");
            return response.data.id;
        } catch (error) {
            throw new ExternalApiError("카카오 연결 끊기 요청 중 오류 발생", error as Error);
        }

    }

    //토큰 정보 보기
    public async get_token_info(access_token: string): Promise<string> {
        logger.info("Fetching Kakao token info...");
        try {
            const response = await axiosKapi.get('/v1/user/access_token_info', {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                }
            })
            logger.info("Kakao token info fetched successfully");
            return response.data.id;
        } catch (error) {
            throw new ExternalApiError("카카오 토큰 정보 조회 중 오류 발생", error as Error);
        }

    }
    //토큰 갱신하기
    public async refresh_token(refresh_token: string): Promise<Token> {
        logger.info("Refreshing Kakao token...");
        try {
            const response = await axiosKauth.post('/oauth/token', {
                grant_type: 'refresh_token',
                client_id: this.clientID,
                refresh_token: refresh_token,
                client_secret: this.clientSecret,
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            });
            logger.info("Kakao token refreshed successfully");
            return {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_in: response.data.expires_in
                    ? response.data.expires_in
                    : null,
                refresh_token_expires_in: response.data.refresh_token_expires_in
                    ? response.data.refresh_token_expires_in
                    : null,
            };
        } catch (error) {
            throw new ExternalApiError("카카오 토큰 갱신 요청 중 오류 발생", error as Error);
        }

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
        logger.info("Requesting Kakao user info...");
        try {
            console.log("액세스 토큰: ", access_token);
            const response = await axiosKapi.get('/v2/user/me', {
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                }

            })
            logger.info("Kakao user info request successful");
            const kakaoAccount = response.data.kakao_account;

            return {
                id: response.data.id,
                email: kakaoAccount.email,
                nickname: kakaoAccount.profile.nickname,
                profileImage: kakaoAccount.profile.profile_image_url,
                phone: kakaoAccount.phone_number
            }
        } catch (error) {
            throw new ExternalApiError("카카오 사용자 정보 요청 중 오류 발생", error as Error);
        }

    }

}

export default KakaoClient;