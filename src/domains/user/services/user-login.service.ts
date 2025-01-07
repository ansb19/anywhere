import { SocialUserService } from "./social-user.service";
import { Inject, Service } from "typedi";
import UserService from "./user.service";
import PasswordService from "@/domains/auth/services/password.service";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/common/exceptions/app.errors";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import { AddDate } from "@/common/utils/formatter";
import { RefreshTokenService } from "@/common/services/refresh_token.service";

@Service()
export class UserLoginService {
    constructor(
        @Inject(() => UserService) private userService: UserService,
        @Inject(() => PasswordService) private passwordService: PasswordService,
        @Inject(() => SessionService) private session: SessionService,
        @Inject(() => SocialUserService) private socialuserService: SocialUserService,
        @Inject(() => RefreshTokenService) private refreshTokenService: RefreshTokenService,
    ) { }


    /**
     * 자체 회원 로그인
     * @param anywhere_id User의 자체 회원 id
     * @param password User의 password (해쉬 이전)
     * @param client_type app, web
     * @returns true
     */
    public async loginAnywhere(anywhere_id: string, password: string, client_type: SESSION_TYPE): Promise<boolean> {
        try {
            const user = await this.userService.findOne({ anywhere_id });

            if (!user) {
                throw new NotFoundError(`유저 아이디가 틀리거나 존재하지 않습니다.`);
            }

            const isPasswordValid = await this.passwordService.verifyPassword(password, user.password_hash!);
            if (!isPasswordValid) {
                throw new UnauthorizedError("비밀번호를 확인해주세요.");
            }
            if (client_type !== (SESSION_TYPE.APP || SESSION_TYPE.WEB))
                throw new ValidationError("Invalid login type");

            const sessionKey = `user:${user.id}:${client_type}`;
            const sessionData = JSON.stringify({
                anywhere_id,
                client_type,
                loginTime: new Date(),
            });

            const existingSession = await this.session.getSession(sessionKey, client_type);
            console.log(`existingSession:${existingSession}, client_type:${client_type}`);
            if (existingSession)
                await this.session.refreshSession(sessionKey, client_type);
            else
                await this.session.setSession(sessionKey, sessionData, client_type);

            return isPasswordValid;
        } catch (err) {
            console.error("Error UserLoginService loginAnywhere: ", err);
            throw err instanceof NotFoundError || err instanceof UnauthorizedError || err instanceof ValidationError
                ? err
                : new ValidationError("Login process failed", err as Error);
        }
    }

    // 소셜 로그인
    /**
     * 
     * @param provider_user_id 소셜 고유번호
     * @param provider_type kakao, google etc..
     * @param client_type web, app
     * @returns true
     */
    public async loginSocial(provider_user_id: string, provider_type: userType, client_type: SESSION_TYPE): Promise<boolean> {
        try {
            const socialUser = await this.socialuserService.findSocialUserByProviderID(provider_user_id, provider_type).catch(() => null);

            if (!socialUser) {
                throw new NotFoundError(`해당 소셜 유저가 없습니다. 회원가입 해주세요.`);
            }
            if (client_type !== SESSION_TYPE.WEB && client_type !== SESSION_TYPE.APP)
                throw new ValidationError("Invalid login type");

            const target_date = AddDate(new Date(), 1);
            const stored_date = socialUser.refresh_token_expires_at;
            await this.refreshTokenService.manual_refresh_token(target_date, stored_date, socialUser.refresh_token, socialUser.id);
            // 리프레시 토큰 시간 체크 후 1달 미만 갱신

            const sessionKey = `social_user:${socialUser.id}:${client_type}`;
            const sessionData = JSON.stringify({
                provider_user_id,
                provider_type,
                client_type,
                loginTime: new Date(),
            });

            const exist_session = await this.session.getSession(sessionKey, client_type);
            console.log(`existingSession:${exist_session}, client_type:${client_type}`);
            if (exist_session) {
                await this.session.refreshSession(sessionKey, client_type);
                console.log(`sessionKey:${sessionKey}가 갱신되었습니다.`)
            }
            else {
                await this.session.setSession(sessionKey, sessionData, client_type);
                console.log(`sessionKey:${sessionKey}가 생성되었습니다.`)
            }
            return !!socialUser;
        } catch (err) {
            console.error("Error UserLoginService loginSocial: ", err);
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Social login process failed", err as Error);
        }
    }

}




export default UserLoginService;
