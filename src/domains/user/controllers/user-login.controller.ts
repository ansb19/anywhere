import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import UserLoginService from "../services/user-login.service";
import { NextFunction, Request, Response } from 'express';

import { NotFoundError } from "@/common/exceptions/app.errors";
import { SESSION_TYPE } from "@/config/enum_control";
import { logger } from "@/common/utils/logger";


@Service()
export class UserLoginController extends BaseController {
    constructor(@Inject(() => UserLoginService) private userlogin_service: UserLoginService) {
        super()
    }

    public login_anywhere = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received login_anywhere request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const userAgent = req.headers['user-agent'] || '';
            const { anywhere_id, password } = req.body
            let client_Type: SESSION_TYPE;

            // 클라이언트 타입 판별
            if (userAgent.includes('MyApp')) {
                client_Type = SESSION_TYPE.APP;
                logger.info(`Client type determined as APP for anywhere_id: ${anywhere_id}`);
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = SESSION_TYPE.WEB;
                logger.info(`Client type determined as WEB for anywhere_id: ${anywhere_id}`);

            }
            else {
                logger.warn(`Invalid user-agent: ${userAgent}`);
                throw new NotFoundError(`자체 로그인 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            // 로그인 처리
            logger.info(`Processing login for anywhere_id: ${anywhere_id}, client_type: ${client_Type}`);
            const isLogin = await this.userlogin_service.loginAnywhere(anywhere_id, password, client_Type);

            if (isLogin) {
                logger.info(`User anywhere_id: ${anywhere_id} logged in successfully`);
                return {
                    status: 200,
                    message: "자체 로그인 성공",
                    data: isLogin,
                }
            } else {
                logger.warn(`Failed to log in user anywhere_id: ${anywhere_id}`);
                return {
                    status: 401,
                    message: "자체 로그인 실패",
                    data: isLogin,
                }
            }
        })
    }

    public login_social = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received login_social request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const { provider_user_id, provider_type } = req.body
            const userAgent = req.headers['user-agent'] || '';
            let client_Type: SESSION_TYPE;


            if (userAgent.includes('MyApp')) {
                client_Type = SESSION_TYPE.APP;
                logger.info(`Client type determined as APP for provider_user_id: ${provider_user_id}`);
            }
            else if (userAgent.includes('Mozilla')) {
                client_Type = SESSION_TYPE.WEB;
                logger.info(`Client type determined as WEB for provider_user_id: ${provider_user_id}`);
            }
            else {
                logger.warn(`Invalid user-agent: ${userAgent}`);
                throw new NotFoundError(`소셜 로그인 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            // 로그인 처리
            logger.info(`Processing social login for provider_user_id: ${provider_user_id}, provider_type: ${provider_type}, client_type: ${client_Type}`);
            const isLogin = await this.userlogin_service.loginSocial(provider_user_id, provider_type, client_Type);

            if (isLogin) {
                logger.info(`Social user provider_user_id: ${provider_user_id} logged in successfully`);
                return {
                    status: 200,
                    message: "소셜 로그인 성공",
                    data: isLogin,
                }
            } else {
                logger.warn(`Failed to log in social user provider_user_id: ${provider_user_id}`);
                return {
                    status: 401,
                    message: "소셜 로그인 실패",
                    data: isLogin,
                }
            }
        })
    }
}