
import { ValidationError } from "@/common/exceptions/app.errors";
import { logger } from "@/common/utils/logger";
import { EnvConfig } from "@/config/env-config";
import bcrypt from "bcrypt";
import { Inject, Service } from "typedi";

@Service()
export class PasswordService {
    saltRounds: number;
    constructor(@Inject(()=> EnvConfig) config: EnvConfig) {
        this.saltRounds = config.SALT_ROUNDS;
        logger.info(`PasswordService initialized with saltRounds: ${this.saltRounds}`);
    }

    async hashPassword(password: string): Promise<string | undefined> { //비밀번호 해시
        logger.info("Starting password hashing...");
        try {
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            logger.info("Password hashed successfully.");
            return hashedPassword;
        }
        catch (error) {
            throw new ValidationError("비밀번호 해싱 중 오류 발생", error as Error);
        }
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean | undefined> { // 비밀번호 해시해제
        logger.info("Starting password verification...");
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            logger.info(`Password verification ${match ? "successful" : "failed"}.`);
            return match; //true or false;
        }
        catch (error) {
            throw new ValidationError("비밀번호 검증 중 오류 발생", error as Error);
        }
    }
}

export default PasswordService; 