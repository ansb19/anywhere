import { ISocialService } from "../services/auth/ISocialAuthService";
import Controller from "./Controller";
import { Request, Response } from "express";



class KakaoController extends Controller {
    private kakaoService: ISocialService; // DIP 의존성 역전 원칙
    constructor(kakaoService: ISocialService) {
        super();
        this.kakaoService = kakaoService;
    }

    public getKakaoAuthURL = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const clientID = process.env.KAKAO_DEV_REST_API_KEY;
            const redirecturi = process.env.KAKAO_DEV_REDIRECT_URI_PRO;
            const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${clientID}&redirect_uri=${redirecturi}&response_type=code`;
            return {
                status: 200,
                message: '카카오 로그인 URL 생성 성공',
                data: kakaoAuthURL,
            }
        })
    }

    public kakaoCallback = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const code = req.query.code as string;
            console.log('Received code:', code);
            const accessToken = await this.kakaoService.getAccessToken(code);
            const userInfo = await this.kakaoService.getUserInfo(accessToken);

            return {
                status: 200,
                message: '카카오 로그인 성공',
                data: userInfo,
            }
        })
    }

}
export default KakaoController;