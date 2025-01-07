import CoolsmsMessageService from "coolsms-node-sdk";
import { Inject, Service } from "typedi";
import { EnvConfig } from "@/config/env-config";
import { generateVerificationCode } from "@/common/utils/verification-code";
import { ValidationError } from "@/common/exceptions/app.errors";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE } from "@/config/enum_control";
import { AuthService } from "@/common/abstract/base.auth.service";
import { logger } from "@/common/utils/logger";



@Service()
export class SMSAuthService extends AuthService {
    private messageService: CoolsmsMessageService;

    constructor(@Inject(() => EnvConfig) private readonly config: EnvConfig,
        @Inject(() => SessionService) private SessionService: SessionService,) {
        super();

        try {
            this.messageService = new CoolsmsMessageService(
                this.config.SMS_API_KEY as string,
                this.config.SMS_API_SECRET as string);
            logger.info("SMS service initialized successfully.");
        } catch (error) {
            throw new ValidationError("SMS 서비스 초기화 중 오류 발생", error as Error);
        }

    }

    //기본
    async send_sms(phone: string, text: string): Promise<void> {
        logger.info(`Sending SMS to ${phone} with text: ${text}`);
        try {
            const result = await this.messageService.sendOne({
                to: `${phone}`, //수신자
                from: `${(this.config.SENDER_PHONE)}`, // 발신자
                text: `${text}`,
                autoTypeDetect: false,
                type: 'SMS'
            })
            logger.info(`SMS sent successfully to ${phone}: ${JSON.stringify(result)}`);
        } catch (error) {
            throw new ValidationError("SMS 전송 중 오류 발생", error as Error);
        }

    }

    //sms 인증 번호 전송
    public async sendVerification(phone_number: string): Promise<void> {
        let cert_code: string = generateVerificationCode(); // 인증 번호 생성
        const text: string = `anywhere 인증 번호가 도착하였습니다\n${cert_code}\n를 입력해주세요.`;

        try {
            logger.info(`Storing verification code session for ${phone_number}: ${cert_code}`);
            await this.SessionService.setSession(phone_number, cert_code, SESSION_TYPE.SMS);
            logger.info(`Session stored successfully for ${phone_number}`);

            await this.send_sms(phone_number, text);
            logger.info(`Verification SMS sent to ${phone_number} with code: ${cert_code}`);
        } catch (error) {
            throw new ValidationError("SMS 인증 번호 전송 중 오류 발생", error as Error);
        }
    }

}

export default SMSAuthService;