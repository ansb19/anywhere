import BaseController from "@/common/abstract/base-controller.abstract";
import { Inject, Service } from "typedi";
import { VerificaionService } from "../services/verification.service";
import EmailAuthService from "../services/email-auth.service";
import { In } from "typeorm";
import SMSAuthService from "../services/sms-auth.service";
import { NextFunction, Request, Response } from "express";

@Service()
export class AuthController extends BaseController {
    constructor(@Inject(() => VerificaionService) private VerificaionService: VerificaionService,
        @Inject(() => EmailAuthService) private EmailAuthService: EmailAuthService,
        @Inject(() => SMSAuthService) private SMSAuthService: SMSAuthService) {
        super()
    }

    public sendSMSAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { phone } = req.body;

            await this.SMSAuthService.sendVerification(phone);

            return {
                status: 200,
                message: '인증 문자 전송',
                data: null,
            }
        })
    }

    public sendEmailAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { email } = req.body;

            await this.EmailAuthService.sendVerification(email);

            return {
                status: 200,
                message: '인증 이메일 전송',
                data: null,
            }
        })
    }

    public verifyCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.execute(req, res, next, async () => {
            const { verification_type, verification_value, submitted_code } = req.body;

            const is_verified = await this.VerificaionService.verifyCode(verification_type, verification_value, submitted_code)

            return {
                status: 200,
                message: '인증 성공',
                data: is_verified,
            }
        })
    }

}