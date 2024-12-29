import { error } from "console";
import { SocialUserService } from "./social-user.service";
import { Inject, Service } from "typedi";
import UserService from "./user.service";
import PasswordService from "@/domains/auth/services/password.service";
import RedisService from "@/common/services/redis.service";
import { clientType, userType } from "@/common/utils/define-type";
import { User } from "../entities/user.entity";
import { SocialUser } from "../entities/social-user.entity";
import { NotFoundError, ValidationError, UnauthorizedError } from "@/common/exceptions/app.errors";
import { EXPIRED_TIME } from "@/config/enum_control";

@Service()
export class UserLoginService {
    constructor(
        @Inject(() => UserService) private userService: UserService,
        @Inject(() => PasswordService) private passwordService: PasswordService,
        @Inject(() => RedisService) private redisService: RedisService,
        @Inject(() => SocialUserService) private socialuserService: SocialUserService,
    ) { }

    // 자체 회원 로그인
    public async loginAnywhere(anywhere_id: string, password: string, loginType: clientType): Promise<boolean> {
        try {
            const user = await this.userService.findOne({ anywhere_id });

            if (!user) {
                throw new NotFoundError(`유저 아이디가 틀립니다`);
            }

            const isPasswordValid = await this.passwordService.verifyPassword(password, user.password_hash!);
            if (!isPasswordValid) {
                throw new UnauthorizedError("비밀번호를 확인해주세요.");
            }

            const sessionKey = `session:${anywhere_id}:${loginType}`;
            const sessionData = JSON.stringify({
                anywhere_id,
                loginType,
                loginTime: new Date(),
            });

            switch (loginType) {
                case clientType.WEB:
                    const existingSession = await this.redisService.getSession(sessionKey);
                    if (existingSession) {
                        await this.redisService.refreshSession(sessionKey, EXPIRED_TIME.LOGIN_SEC);
                    } else {
                        await this.redisService.setSession(sessionKey, sessionData, EXPIRED_TIME.LOGIN_SEC);
                    }
                    break;

                case clientType.APP:
                    await this.redisService.setSession(sessionKey, sessionData);
                    break;

                default:
                    throw new ValidationError("Invalid login type");
            }

            return true;
        } catch (err) {
            console.error("Error UserLoginService login: ", err);
            throw err instanceof NotFoundError || err instanceof UnauthorizedError || err instanceof ValidationError
                ? err
                : new ValidationError("Login process failed", err as Error);
        }
    }

    // 소셜 로그인
    public async loginSocial(provider_user_id: string, provider_type: userType, loginType: clientType): Promise<boolean> {
        try {
            const socialUser = await this.socialuserService.findSocialUserByProviderID(provider_user_id, provider_type);

            if (!socialUser) {
                throw new NotFoundError(`해당 소셜 유저가 없습니다. 회원가입 해주세요.`);
            }

            const sessionKey = `session:${provider_user_id}:${provider_type}:${loginType}`;
            const sessionData = JSON.stringify({
                provider_user_id,
                provider_type,
                loginType,
                loginTime: new Date(),
            });

            switch (loginType) {
                case clientType.WEB: // 웹
                    const existingSession = await this.redisService.getSession(sessionKey);
                    if (existingSession) {
                        await this.redisService.refreshSession(sessionKey, EXPIRED_TIME.LOGIN_SEC);
                    } else {
                        await this.redisService.setSession(sessionKey, sessionData, EXPIRED_TIME.LOGIN_SEC);
                    }
                    break;

                case clientType.APP: // 앱
                    //세션 무제한 추가
                    await this.redisService.setSession(sessionKey, sessionData);
                    break;

                default:
                    throw new ValidationError("Invalid login type");
            }

            return true;
        } catch (err) {
            console.error("Error UserLoginService loginSocial: ", err);
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Social login process failed", err as Error);
        }
    }
}

export default UserLoginService;
