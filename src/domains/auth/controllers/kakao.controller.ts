import KakaoClient from "@/api/kakao.client";
import BaseController from "@/common/abstract/base-controller.abstract";
import { NextFunction, Request, Response } from "express";
import { Inject, Service } from "typedi";


@Service()
class KakaoController extends BaseController {
    private kakaoClient: KakaoClient; // DIP 의존성 역전 원칙
    constructor(@Inject(() => KakaoClient) kakaoClient: KakaoClient) {
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
            console.log(`Received data:`, data,);
            console.log(`${typeof data.access_token}`);

            const data2 = await this.kakaoClient.get_token_info(data.access_token);
            console.log(data2);
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