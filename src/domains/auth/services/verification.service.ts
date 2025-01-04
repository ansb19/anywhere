
import { ValidationError } from "@/common/exceptions/app.errors";
import RedisService from "@/common/services/redis.service";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE } from "@/config/enum_control";
import { Inject, Service } from "typedi";


@Service()
export class VerificaionService {
    constructor(@Inject(() => SessionService) private SessionService: SessionService) {

    }

    public async verifyCode(verification_type: SESSION_TYPE, verification: string, submitted_code: string,): Promise<boolean> {
        const verified_code = await this.SessionService.getSession(verification, verification_type);
        if (!verified_code)
            throw new ValidationError("인증번호가 만료되었거나 존재하지 않습니다.");
        else if (verified_code !== submitted_code)
            throw new ValidationError("인증번호가 일치하지 않습니다");
        return !!(verified_code);
    }
}