import { SocialUserService } from "./social-user.service";
import { Inject, Service } from "typedi";
import UserService from "./user.service";
import PasswordService from "@/domains/auth/services/password.service";
import { clientType, userType } from "@/common/utils/define-type";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/common/exceptions/app.errors";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE } from "@/config/enum_control";
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
     * @param clent_type app, web
     * @returns true
     */
    public async loginAnywhere(anywhere_id: string, password: string, clent_type: clientType): Promise<boolean> {
        try {
            const user = await this.userService.findOne({ anywhere_id });

            if (!user) {
                throw new NotFoundError(`유저 아이디가 틀리거나 존재하지 않습니다.`);
            }

            const isPasswordValid = await this.passwordService.verifyPassword(password, user.password_hash!);
            if (!isPasswordValid) {
                throw new UnauthorizedError("비밀번호를 확인해주세요.");
            }

            const sessionKey = `user:${user.id}:${clent_type}`;
            const sessionData = JSON.stringify({
                anywhere_id,
                clent_type,
                loginTime: new Date(),
            });

            switch (clent_type) {
                case clientType.WEB:
                    const exist_session = await this.session.getSession(sessionKey, SESSION_TYPE.LOGIN_WEB);

                    if (exist_session) {

                        await this.session.refreshSession(sessionKey, SESSION_TYPE.LOGIN_WEB);
                    } else {
                        await this.session.setSession(sessionKey, sessionData, SESSION_TYPE.LOGIN_WEB);
                    }
                    break;

                case clientType.APP:
                    await this.session.setSession(sessionKey, sessionData, SESSION_TYPE.LOGIN_APP);
                    break;

                default:
                    throw new ValidationError("Invalid login type");
            }

            return isPasswordValid;
        } catch (err) {
            console.error("Error UserLoginService login: ", err);
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
     * @param clent_type web, app
     * @returns true
     */
    public async loginSocial(provider_user_id: string, provider_type: userType, clent_type: clientType): Promise<boolean> {
        try {
            const socialUser = await this.socialuserService.findSocialUserByProviderID(provider_user_id, provider_type);

            if (!socialUser) {
                throw new NotFoundError(`해당 소셜 유저가 없습니다. 회원가입 해주세요.`);
            }

            const target_date = AddDate(new Date(), 1);
            const stored_date = socialUser.refresh_token_expires_at;
            this.refreshTokenService.manual_refresh_token(target_date,stored_date,socialUser.refresh_token,socialUser.id);


            const sessionKey = `social_user:${socialUser.id}:${clent_type}`;
            const sessionData = JSON.stringify({
                provider_user_id,
                provider_type,
                clent_type,
                loginTime: new Date(),
            });

            const existingSession = await this.session.getSession(sessionKey, SESSION_TYPE.LOGIN_WEB);
            switch (clent_type) {
                case clientType.WEB: // 웹 60분
                    if (existingSession)
                        await this.session.refreshSession(sessionKey, SESSION_TYPE.LOGIN_WEB);
                    else
                        await this.session.setSession(sessionKey, sessionData, SESSION_TYPE.LOGIN_WEB);
                    break;

                case clientType.APP:
                    if (existingSession)
                        await this.session.refreshSession(sessionKey, SESSION_TYPE.LOGIN_APP);
                    else
                        await this.session.setSession(sessionKey, sessionData, SESSION_TYPE.LOGIN_APP);
                    break;

                default:
                    throw new ValidationError("Invalid login type");
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
