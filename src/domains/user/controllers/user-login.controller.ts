import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import UserLoginService from "../services/user-login.service";
import { NextFunction, Request, Response } from 'express';
import { clientType } from "@/common/utils/define-type";
import { NotFoundError } from "@/common/exceptions/app.errors";


@Service()
export class UserLoginController extends BaseController {
    constructor(@Inject(() => UserLoginService) private userlogin_service: UserLoginService) {
        super()
    }

    public login_anywhere = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const userAgent = req.headers['user-agent'] || '';
            const { anywhere_id, password } = req.body
            let client_Type: clientType;
            if (userAgent.includes('MyApp')) {
                client_Type = clientType.APP;
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = clientType.WEB;
            }
            else {
                throw new NotFoundError(`자체 로그인 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            const isLogin = await this.userlogin_service.loginAnywhere(anywhere_id, password, client_Type);
            return {
                status: 200,
                message: "로그인 성공",
                data: isLogin,
            }
        })
    }

    public login_social = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const userAgent = req.headers['user-agent'] || '';
            const { provider_user_id, provider_type } = req.body
            let client_Type: clientType;
            if (userAgent.includes('MyApp')) {
                client_Type = clientType.APP;
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = clientType.WEB;
            }
            else {
                throw new NotFoundError(`소셜 로그인 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            const isLogin = await this.userlogin_service.loginSocial(provider_user_id, provider_type, client_Type);
        })
    }
}