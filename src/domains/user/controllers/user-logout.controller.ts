import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import { UserLogoutService } from "../services/user-logout.service";
import { NextFunction, Request, Response } from 'express';
import { SESSION_TYPE } from "@/config/enum_control";
import { NotFoundError } from "@/common/exceptions/app.errors";

@Service()
export class UserLogoutController extends BaseController {
    constructor(
        @Inject(() => UserLogoutService) private UserLogoutService: UserLogoutService,

    ) {
        super();
    }

    public logout_anywhere = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { anywhere_id } = req.body;
            const userAgent = req.headers['user-agent'] || '';
            let client_Type: SESSION_TYPE;

            if (userAgent.includes('MyApp')) {
                client_Type = SESSION_TYPE.APP;
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = SESSION_TYPE.WEB;
            }
            else {
                throw new NotFoundError(`자체 로그아웃 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            const is_logout = await this.UserLogoutService.logoutAnywhere(anywhere_id, client_Type);
            return {
                status: 200,
                message: "로그아웃 성공",
                data: is_logout,
            }
        })
    }

    public logout_social = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { provider_user_id, provider_type } = req.body;
            const userAgent = req.headers['user-agent'] || '';
            let client_Type: SESSION_TYPE;

            if (userAgent.includes('MyApp')) {
                client_Type = SESSION_TYPE.APP;
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = SESSION_TYPE.WEB;
            }
            else {
                throw new NotFoundError(`소셜 로그인 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            const is_logout = await this.UserLogoutService.logoutSocial(provider_user_id, provider_type, client_Type);
            return {
                status: 200,
                message: "로그아웃 성공",
                data: is_logout,
            }
        })
    }
}