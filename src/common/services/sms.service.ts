import CoolsmsMessageService from "coolsms-node-sdk";
import { Inject, Service } from "typedi";
import { EnvConfig } from "@/config/env-config";
import { ValidationError } from "@/common/exceptions/app.errors";

import { logger } from "@/common/utils/logger";



@Service()
export class SMSService {
    private messageService: CoolsmsMessageService;

    constructor(@Inject(() => EnvConfig) private readonly config: EnvConfig) {
        
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
}