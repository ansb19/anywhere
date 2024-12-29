import KakaoClient from "@/api/kakao.client";
import BaseController from "@/common/abstract/base-controller.abstract";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";


@Service()
class KakaoController extends BaseController {
    @Inject(() => KakaoClient) private kakaoClient: KakaoClient; // DIP 의존성 역전 원칙
    constructor(kakaoClient: KakaoClient) {
        super();
        this.kakaoClient = kakaoClient;
    }

    public getKakaoAuthURL = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {

            return {
                status: 200,
                message: '카카오 로그인 URL 생성 성공',
                data: this.kakaoClient.get_url()
            }
        })
    }

    public kakaoCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const code = req.query.code as string;
            console.log('Received code:', code);
            const data = await this.kakaoClient.request_token(code);

            const userInfo = await this.kakaoClient.request_user_info(data.access_token);

            return {
                status: 200,
                message: '카카오 로그인 성공',
                data: userInfo,
            }
        })
    }

}
export default KakaoController;