import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { logger } from "@/common/utils/logger";

@Service()
export class AuthController extends BaseController {
    constructor(@Inject(() => AuthService) private auth: AuthService) {
        super()
    }
    public sendSMSAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received sendSMSAuth request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const { phone } = req.body;

            await this.auth.send_auth_sms(phone);

            return {
                status: 200,
                message: '인증 문자 전송',
            }
        })
    }

    public sendEmailAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received sendEmailAuth request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);

            const { email } = req.body;

            await this.auth.send_auth_email(email);

            return {
                status: 200,
                message: '인증 이메일 전송',
            }
        })
    }

    public verifyCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            logger.info('Received verifyCode request');
            logger.debug(`Request body: ${JSON.stringify(req.body)}`);
            const { verification_type, verification_value, submitted_code } = req.body;

            const is_verified = await this.auth.verifyCode(verification_type, verification_value, submitted_code);

            return {
                status: 200,
                message: '인증 성공',
                data: is_verified,
            }
        })
    }

}