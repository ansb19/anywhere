import { ValidationError } from "../../../../test/app.errors";
import RedisService from "@/common/services/redis.service";
import { Inject, Service } from "typedi";


@Service()
export class VerificaionService {
    constructor(@Inject(() => RedisService) private redis: RedisService) {

    }

    public async verifyCode(verification: string, submitted_code: string): Promise<boolean> {
        const verified_code = await this.redis.getSession(verification);
        if (!verified_code)
            throw new ValidationError("인증번호가 만료되었거나 존재하지 않습니다.");
        else if (verified_code !== submitted_code)
            throw new ValidationError("인증번호가 일치하지 않습니다");
        return !!(verified_code);
    }
}