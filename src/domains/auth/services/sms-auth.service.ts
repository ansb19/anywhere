import CoolsmsMessageService from "coolsms-node-sdk";
import RedisService from "../../../common/services/redis.service";
import { Inject, Service } from "typedi";
import { EnvConfig } from "@/config/env-config";
import { generateVerificationCode } from "@/common/utils/verification-code";
import { EXPIRED_TIME } from "@/config/enum_control";
import { ValidationError } from "@/common/exceptions/app.errors";



@Service()
export class SMSAuthService extends AuthService {
    private messageService: CoolsmsMessageService;

    constructor(@Inject(() => EnvConfig) private readonly config: EnvConfig,
        @Inject(() => RedisService) private redis: RedisService,) {
        super();

        try {
            this.messageService = new CoolsmsMessageService(
                this.config.SMS_API_KEY as string,
                this.config.SMS_API_SECRET as string);
            console.log("SMS 서비스 초기화 완료");
        } catch (error) {
            console.error("Error initializing SMSAuthService: ", error);
            throw new ValidationError("SMS 서비스 초기화 중 오류 발생", error as Error);
        }

    }

    //기본
    async send_sms(phone: string, text: string): Promise<void> {
        try {
            const result = await this.messageService.sendOne({
                to: `${phone}`, //수신자
                from: `${(this.config.SENDER_PHONE)}`, // 발신자
                text: `${text}`,
                autoTypeDetect: false,
                type: 'SMS'
            })
            console.log(`SMS 전송 성공: ${JSON.stringify(result)}`);
        } catch (error) {
            console.error(`SMS 전송 실패: ${phone}`, error);
            throw new ValidationError("SMS 전송 중 오류 발생", error as Error);
        }

    }

    //sms 인증 번호 전송
    public async sendVerification(phone_number: string): Promise<void> {
        let cert_code: string = generateVerificationCode(); // 인증 번호 생성
        const text: string = `anywhere 인증 번호가 도착하였습니다\n${cert_code}\n를 입력해주세요.`;

        await this.redis.set(phone_number, cert_code, EXPIRED_TIME.SMS_SEC);

        console.log(`세션 저장: ${phone_number} 인증번호: ${cert_code}`);
        return await this.send_sms(phone_number, text);
    }

}

export default SMSAuthService;