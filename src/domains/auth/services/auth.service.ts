import { Inject, Service } from "typedi";

import { EmailService } from "@/common/services/email.service";
import { generateVerificationCode } from "@/common/utils/verification-code";
import { logger } from "@/common/utils/logger";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE } from "@/config/enum_control";
import { ValidationError } from "@/common/exceptions/app.errors";
import { SMSService } from "@/common/services/sms.service";

@Service()
export class AuthService {

    constructor(@Inject(() => SMSService) private sms: SMSService,
        @Inject(() => EmailService) private email: EmailService,
        @Inject(() => SessionService) private SessionService: SessionService,) {

    }

    //sms 인증 번호 전송
    public async send_auth_sms(phone_number: string): Promise<void> {
        let cert_code: string = generateVerificationCode(); // 인증 번호 생성
        const text: string = `anywhere 인증 번호가 도착하였습니다\n${cert_code}\n를 입력해주세요.`;

        try {
            logger.info(`Storing verification code session for ${phone_number}: ${cert_code}`);
            await this.SessionService.setSession(phone_number, cert_code, SESSION_TYPE.SMS);
            logger.info(`Session stored successfully for ${phone_number}`);

            await this.sms.send_sms(phone_number, text);
            logger.info(`Verification SMS sent to ${phone_number} with code: ${cert_code}`);
        } catch (error) {
            throw new ValidationError("SMS 인증 번호 전송 중 오류 발생", error as Error);
        }
    }

    //이메일 인증 번호 전송

    public async send_auth_email(email_address: string): Promise<void> {
        const subject: string = 'anywhere 인증번호가 도착하였습니다.';
        let cert_code: string = generateVerificationCode();
        const text: string = `anywhere 인증 번호가 도착하였습니다. 인증번호: ${cert_code} 를 10분 안에 입력해주세요.`;
        const html: string = `
    <p>anywhere 인증 번호가 도착하였습니다.</p>
    <h3 style="font-size: 1.5em; font-weight: bold; color: #333;">${cert_code}</h3>
    <p>를 10분 안에 입력해주세요.</p>
`;

        try {
            logger.info(`Storing verification code session for ${email_address}: ${cert_code}`);
            await this.SessionService.setSession(email_address, cert_code, SESSION_TYPE.EMAIL) //10분
            logger.info(`Session stored successfully for ${email_address}: ${cert_code}`);
            await this.email.sendMail(email_address, subject, text, html);
            logger.info(`Verification email sent to ${email_address} with code: ${cert_code}`);
        } catch (error) {
            throw new ValidationError("인증 번호 전송 중 오류 발생", error as Error);
        }
    }

    public async verifyCode(verification_type: SESSION_TYPE, verification: string, submitted_code: string,): Promise<boolean> {
        logger.info(`Verifying code for ${verification_type} - ${verification}`);

        const verified_code = await this.SessionService.getSession(verification, verification_type);
        if (!verified_code) {
            logger.warn(`Verification code expired or not found for ${verification_type} - ${verification}`);
            throw new ValidationError("인증번호가 만료되었거나 존재하지 않습니다.");
        }
        else if (verified_code !== submitted_code) {
            logger.warn(`Verification code mismatch for ${verification_type} - ${verification}`);
            throw new ValidationError("인증번호가 일치하지 않습니다");
        }
        else if (verified_code === submitted_code) {
            logger.info(`Verification successful for ${verification_type} - ${verification}`);
            return !!(verified_code);
        }
        logger.error(`Unknown error occurred during verification for ${verification_type} - ${verification}`);
        throw new ValidationError("인증에서 알 수 없는 오류가 발생했습니다");
    }
}