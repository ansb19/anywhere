import { ValidationError } from "@/common/exceptions/app.errors";
import { EnvConfig } from "@/config/env-config";
import bcrypt from "bcrypt";
import { Inject, Service } from "typedi";

@Service()
export class PasswordService {
    saltRounds: number;
    constructor(@Inject(()=> EnvConfig) config: EnvConfig) {
        this.saltRounds = config.SALT_ROUNDS;
    }

    async hashPassword(password: string): Promise<string | undefined> { //비밀번호 해시
        try {
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);
            return hashedPassword;
        }
        catch (error) {
            console.error(`Error password.service hashPassword: ${error}`);
            throw new ValidationError("비밀번호 해싱 중 오류 발생", error as Error);
        }
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean | undefined> { // 비밀번호 해시해제
        try {
            const match = await bcrypt.compare(password, hashedPassword);
            return match; //true or false;
        }
        catch (error) {
            console.error(`Error password.service verifyPassword: ${error}`);
            throw new ValidationError("비밀번호 검증 중 오류 발생", error as Error);
        }
    }
}

export default PasswordService; 