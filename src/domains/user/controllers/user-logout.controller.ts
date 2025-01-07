import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import { UserLogoutService } from "../services/user-logout.service";
import { NextFunction, Request, Response } from 'express';
import { SESSION_TYPE } from "@/config/enum_control";
import { NotFoundError } from "@/common/exceptions/app.errors";
import { logger } from "@/common/utils/logger";

@Service()
export class UserLogoutController extends BaseController {
    constructor(
        @Inject(() => UserLogoutService) private UserLogoutService: UserLogoutService,

    ) {
        super();
    }

    public logout_anywhere = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received logout_anywhere request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const { anywhere_id } = req.body;
            const userAgent = req.headers['user-agent'] || '';
            let client_Type: SESSION_TYPE;

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
                throw new NotFoundError(`자체 로그아웃 request userAgent에서 에러 발생 userAgent: ${userAgent}`);
            }

            // 로그아웃 처리
            logger.info(`Processing logout for anywhere_id: ${anywhere_id}, client_type: ${client_Type}`);
            const is_logout = await this.UserLogoutService.logoutAnywhere(anywhere_id, client_Type);

            if (is_logout) {
                logger.info(`User anywhere_id: ${anywhere_id} logged out successfully`);
                return {
                    status: 200,
                    message: "자체 로그아웃 성공",
                    data: is_logout,
                }
            } else {
                logger.warn(`Failed to log out user anywhere_id: ${anywhere_id}`);
                return {
                    status: 401,
                    message: "자체 로그아웃 실패",
                    data: is_logout,
                }
            }

        })
    }

    public logout_social = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received logout_social request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const { provider_user_id, provider_type } = req.body;
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

            // 소셜 로그아웃 처리
            logger.info(`Processing social logout for provider_user_id: ${provider_user_id}, provider_type: ${provider_type}, client_type: ${client_Type}`);
            const is_logout = await this.UserLogoutService.logoutSocial(provider_user_id, provider_type, client_Type);
            
            if (is_logout) {
                logger.info(`Social user provider_user_id: ${provider_user_id} logged out successfully`);
                return {
                    status: 200,
                    message: "소셜 로그아웃 성공",
                    data: is_logout,
                }
            } else {
                logger.warn(`Failed to log out social user provider_user_id: ${provider_user_id}`);
                return {
                    status: 401,
                    message: "소셜 로그아웃 실패",
                    data: is_logout,
                }
            }
           
        })
    }
}