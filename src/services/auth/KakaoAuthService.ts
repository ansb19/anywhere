import axios from "axios";
import { ISocialAuthService, SoicalUser } from "./ISocialAuthService";
import dotenv from 'dotenv';
import { axiosKakaoToken, axiosKakaoInfo } from "../../api/axios";


dotenv.config();


export class KaKaoAuthService implements ISocialAuthService {
    private readonly clientID: string = process.env.KAKAO_REST_API_KEY as string;
    private readonly redirectUri: string = process.env.KAKAO_REDIRECT_URI_DEV as string;


    getAccessToken(code: string): Promise<string> {
        const response = await axiosKakaoToken.post('', null{
            params: {
                client_id: this.clientID,
                redirect_uri: this.redirectUri,
                code,
            }
        })
        return response.data.accesssToken;
    }
    getUserInfo(accesssToken: string): Promise<SoicalUser> {
        throw new Error("Method not implemented.");
    }



}
