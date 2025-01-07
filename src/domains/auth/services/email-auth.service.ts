import nodemailer, { Transporter } from 'nodemailer';
import { Inject, Service } from 'typedi';
import { generateVerificationCode } from '@/common/utils/verification-code';
import { EnvConfig } from '@/config/env-config';

import { ValidationError } from '@/common/exceptions/app.errors';
import { SessionService } from '@/common/services/session.service';
import { SESSION_TYPE } from '@/config/enum_control';
import { AuthService } from '@/common/abstract/base.auth.service';
import { logger } from '@/common/utils/logger';

//작은 규모의 애플리케이션이나 단일 서버로 충분한 경우 createClient를 사용합니다.
//데이터가 많고 고가용성이 필요하며 수평적 확장이 필요한 경우 createCluster를 사용합니다

@Service()
export class EmailAuthService extends AuthService {
    emailservice: Transporter;

    constructor(
        @Inject(() => EnvConfig) private readonly config: EnvConfig,
        @Inject(() => SessionService) private SessionService: SessionService,
    ) {
        super();
        try {
            this.emailservice = nodemailer.createTransport({
                service: this.config.EMAIL_SERVICE,
                host: this.config.EMAIL_HOST, // smtp 서버주소
                port: this.config.EMAIL_PORT, //smtp 포트
                auth: {
                    user: this.config.EMAIL_USER, // sender address
                    pass: this.config.EMAIL_PASSWORD
                }
            })
            logger.info("Email service initialized successfully.");
        } catch (error) {
            throw new ValidationError('이메일 서비스 초기화 중 오류가 발생했습니다.', error as Error);
        }
    }

    //기본
    public async sendMail(email_address: string, subject: string, text: string, html: string): Promise<void> {
        const mailOptions = {
            from: this.config.EMAIL_USER,
            to: email_address,
            subject: subject,
            text: text,
            html: html
        }
        try {
            logger.info(`Sending email to ${email_address} with subject: ${subject}`);
            let info = await this.emailservice.sendMail(mailOptions);
            logger.info(`Email sent successfully to ${email_address}: ${info.response}`);
        } catch (error) {
            throw new ValidationError("이메일 전송 중 오류 발생", error as Error);
        }
    }

    //인증 번호 전송

    public async sendVerification(email_address: string): Promise<void> {
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
            await this.sendMail(email_address, subject, text, html);
            logger.info(`Verification email sent to ${email_address} with code: ${cert_code}`);
        } catch (error) {
            throw new ValidationError("인증 번호 전송 중 오류 발생", error as Error);
        }
    }

}

export default EmailAuthService;