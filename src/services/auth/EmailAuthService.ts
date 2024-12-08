import nodemailer, { Transporter } from 'nodemailer';
import RedisService from './RedisService';
import AuthService, { verifyResult } from './AuthService';

//작은 규모의 애플리케이션이나 단일 서버로 충분한 경우 createClient를 사용합니다.
//데이터가 많고 고가용성이 필요하며 수평적 확장이 필요한 경우 createCluster를 사용합니다


export class EmailAuthService extends AuthService {

    emailservice: Transporter;
    constructor() {
        super();
        this.emailservice = nodemailer.createTransport({
            service: 'naver',
            host: 'smtp.naver.com', // smtp 서버주소
            port: 465, //smtp 포트
            auth: {
                user: process.env.EMAIL_USER, // sender address
                pass: process.env.EMAIL_PASSWORD
            }
        })

    }
    //기본
    public async sendMail(email_address: string, subject: string, text: string, html: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email_address,
            subject: subject,
            text: text,
            html: html
        }
        try {
            let info = await this.emailservice.sendMail(mailOptions);
            console.log(`Email sent: ${info.response}`);
        } catch (error) {
            console.error(`email send error: ${error}`);
            //throw error;
        }
    }

    //인증 번호 전송

    public async sendVerification(email_address: string): Promise<void> {
        const subject: string = 'anywhere 인증번호가 도착하였습니다.';
        let cert_code: string = this.generateVerificationCode();
        const text: string =
            `anywhere 인증 번호가 도착하였습니다
        ${cert_code}
        를 입력해주세요.`;
        const html: string = '';

        await RedisService.set(email_address, cert_code, 10 * 60) //10분
        console.log(`이메일 전송: ${email_address} 인증번호: ${cert_code}`);
        return await this.sendMail(email_address, subject, text, html);
    }





    //이메일 인증 번호 검증

    // public async verifyCode(email: string, submitted_code: string): Promise<verifyResult> {
    //     const save_code: string | null = await RedisService.get(email);

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

export default new EmailAuthService();