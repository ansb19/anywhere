import nodemailer, { Transporter } from 'nodemailer';
import { Inject, Service } from 'typedi';
import { EnvConfig } from '@/config/env-config';

import { ValidationError } from '@/common/exceptions/app.errors';
import { logger } from '@/common/utils/logger';

//작은 규모의 애플리케이션이나 단일 서버로 충분한 경우 createClient를 사용합니다.
//데이터가 많고 고가용성이 필요하며 수평적 확장이 필요한 경우 createCluster를 사용합니다

@Service()
export class EmailService {
    emailservice: Transporter;

    constructor(
        @Inject(() => EnvConfig) private readonly config: EnvConfig,
    ) {
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
}