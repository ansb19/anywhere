import { KakaoService } from "../services/auth/KakaoService";
import Controller from "./Controller";
import { Request, Response } from "express";



class KakaoController extends Controller {
    private kakaoService: KakaoService; // DIP 의존성 역전 원칙
    constructor(kakaoService: KakaoService) {
        super();
        this.kakaoService = kakaoService;
    }

    public getKakaoAuthURL = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {

            return {
                status: 200,
                message: '카카오 로그인 URL 생성 성공',
                data: this.kakaoService.get_url()
            }
        })
    }

    public kakaoCallback = async (req: Request, res: Response): Promise<void> => {
        this.execute(req, res, async () => {
            const code = req.query.code as string;
            console.log('Received code:', code);
            const data = await this.kakaoService.request_token(code);

            const userInfo = await this.kakaoService.request_user_info(data.access_token);

            return {
                status: 200,
                message: '카카오 로그인 성공',
                data: userInfo,
            }
        })
    }

}
export default KakaoController;