import CoolsmsMessageService from "coolsms-node-sdk";

import { createClient, RedisClientType } from "redis";
import RedisService from "./RedisService";
import { generateVerificationCode } from "../../utils/verification_code";
import AuthService from "./AuthService";


export class SMSAuthService extends AuthService {

    messageService: CoolsmsMessageService;


    constructor() {
        super();
        this.messageService = new CoolsmsMessageService(
            process.env.SEND_SNS_API_KEY as string,
            process.env.SEND_SNS_API_SECRET as string);


    }

    //기본
    async send_sms(phone: string, text: string): Promise<void> {
        const result = await this.messageService.sendOne({
            to: `${phone}`, //수신자
            from: `${(process.env.SENDER_PHONE)}`, // 발신자
            text: `${text}`,
            autoTypeDetect: false,
            type: 'SMS'
        })
    }

    //sms 인증 번호 전송
    public async sendVerification(phone_number: string): Promise<void> {
        let cert_code: string = generateVerificationCode(); // 인증 번호 생성
        const text: string =
            `anywhere 인증 번호가 도착하였습니다
        ${cert_code}
        를 입력해주세요.`;

        await RedisService.setSession(phone_number, cert_code, 5 * 60) // 5분
        console.log(`SMS 전송: ${phone_number} 인증번호: ${cert_code}`);
        return await this.send_sms(phone_number, text);
    }

    //sms 인증 번호 검증
    // public async verifyCode(phone_number: string, submitted_code: string): Promise<verifyResult> {
    //     const save_code: string | null = await RedisService.get(phone_number);

    //     if (save_code == submitted_code) {
    //         return verifyResult.VERIFIED;
    //     }
    //     else if (save_code == null) {
    //         return verifyResult.EXPIRED;
    //     }
    //     else {
    //         return verifyResult.INVALID;
    //     }
    // }
}

export default new SMSAuthService();