import { SocialUserService } from "./social-user.service";
import { Inject, Service } from "typedi";
import UserService from "./user.service";
import PasswordService from "@/common/services/password.service";
import { NotFoundError, UnauthorizedError, ValidationError } from "@/common/exceptions/app.errors";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import { AddDate } from "@/common/utils/formatter";
import { RefreshTokenService } from "@/common/services/refresh_token.service";
import { logger } from "@/common/utils/logger";

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
        logger.info(`Starting loginAnywhere process for anywhere_id: ${anywhere_id}`);
        try {
            const user = await this.userService.findOne({ anywhere_id });

            if (!user) {
                logger.warn(`User not found for anywhere_id: ${anywhere_id}`);
                throw new NotFoundError(`유저 아이디가 틀리거나 존재하지 않습니다.`);
            }

            logger.debug(`Verifying password for anywhere_id: ${anywhere_id}`);
            const isPasswordValid = await this.passwordService.verifyPassword(password, user.password_hash!);
            if (!isPasswordValid) {
                logger.warn(`Invalid password for anywhere_id: ${anywhere_id}`);
                throw new UnauthorizedError("비밀번호를 확인해주세요.");
            }
            if (client_type !== (SESSION_TYPE.APP || SESSION_TYPE.WEB)) {
                logger.warn(`Invalid login type: ${client_type}`);
                throw new ValidationError("Invalid login type");
            }

            const sessionKey = `user:${user.id}:${client_type}`;
            const sessionData = JSON.stringify({
                anywhere_id,
                client_type,
                loginTime: new Date(),
            });

            logger.debug(`Checking existing session for sessionKey: ${sessionKey}`);
            const existingSession = await this.session.getSession(sessionKey, client_type);

            if (existingSession) {
                logger.info(`Session found for sessionKey: ${sessionKey}, refreshing session.`);
                await this.session.refreshSession(sessionKey, client_type);
            }
            else {
                logger.info(`No session found for sessionKey: ${sessionKey}, creating new session.`);
                await this.session.setSession(sessionKey, sessionData, client_type);
            }
            
            logger.info(`LoginAnywhere process completed successfully for anywhere_id: ${anywhere_id}`);
            return isPasswordValid;
        } catch (err) {
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
        logger.info(`Starting loginSocial process for provider_user_id: ${provider_user_id}, provider_type: ${provider_type}`);

        try {
            //소셜 유저 조회
            logger.debug(`Finding social user by provider_user_id: ${provider_user_id} and provider_type: ${provider_type}`);
            const socialUser = await this.socialuserService.findSocialUserByProviderID(provider_user_id, provider_type).catch(() => null);

            if (!socialUser) {
                logger.warn(`Social user not found for provider_user_id: ${provider_user_id} and provider_type: ${provider_type}`);
                throw new NotFoundError(`해당 소셜 유저가 없습니다. 회원가입 해주세요.`);
            }
            //로그인 타입 검증
            if (client_type !== SESSION_TYPE.WEB && client_type !== SESSION_TYPE.APP){
                logger.warn(`Invalid login type: ${client_type}`);
                throw new ValidationError("Invalid login type");
            }

            //리프레쉬 토큰 관리 ( 1달 미만이면 갱신)
            logger.debug(`Managing refresh token for socialUser ID: ${socialUser.id}`);
            const target_date = AddDate(new Date(), 1);
            const stored_date = socialUser.refresh_token_expires_at;
            await this.refreshTokenService.manual_refresh_token(target_date, stored_date, socialUser.refresh_token, socialUser.id);
            

            const sessionKey = `social_user:${socialUser.id}:${client_type}`;
            const sessionData = JSON.stringify({
                provider_user_id,
                provider_type,
                client_type,
                loginTime: new Date(),
            });

            logger.debug(`Checking existing session for sessionKey: ${sessionKey}`);
            const exist_session = await this.session.getSession(sessionKey, client_type);

            if (exist_session) {
                logger.info(`Session found for sessionKey: ${sessionKey}, refreshing session.`);
                await this.session.refreshSession(sessionKey, client_type);
            }
            else {
                logger.info(`No session found for sessionKey: ${sessionKey}, creating new session.`);
                await this.session.setSession(sessionKey, sessionData, client_type);
            }

            logger.info(`LoginSocial process completed successfully for provider_user_id: ${provider_user_id}`);
            return !!socialUser;
        } catch (err) {
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Social login process failed", err as Error);
        }
    }

}

export default UserLoginService;
