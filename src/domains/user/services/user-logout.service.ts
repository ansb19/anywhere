import { NotFoundError, ValidationError } from "@/common/exceptions/app.errors";
import { SessionService } from "@/common/services/session.service";
import { SESSION_TYPE, userType } from "@/config/enum_control";
import { Inject, Service } from "typedi";
import UserService from "./user.service";
import SocialUserService from "./social-user.service";
import KakaoClient from "@/api/kakao.client";
import { logger } from "@/common/utils/logger";


@Service()
export class UserLogoutService {
    constructor(
        @Inject(() => SessionService) private SessionService: SessionService,
        @Inject(() => UserService) private UserService: UserService,
        @Inject(() => SocialUserService) private SocialUserService: SocialUserService,
        @Inject(() => KakaoClient) private KakaoClient: KakaoClient,
    ) {

    }

    public async logoutAnywhere(anywhere_id: string, client_type: SESSION_TYPE): Promise<boolean> {
        logger.info(`Starting logoutAnywhere process for anywhere_id: ${anywhere_id}`);
        try {
            //세선을 없애야함
            const user = await this.UserService.findOne({ anywhere_id });
            if (!user) {
                logger.warn(`User not found for anywhere_id: ${anywhere_id}`);
                throw new NotFoundError(`유저 아이디가 틀리거나 존재하지 않습니다.`);
            }
            if (client_type !== (SESSION_TYPE.APP || SESSION_TYPE.WEB)) {
                logger.warn(`Invalid login type: ${client_type}`);
                throw new ValidationError("Invalid login type");
            }
            const sessionKey = `user:${user.id}:${client_type}`;
            logger.debug(`Checking session for sessionKey: ${sessionKey}`);
            const exist_session = await this.SessionService.getSession(sessionKey, client_type);

            if (exist_session) {
                logger.info(`Session found for sessionKey: ${sessionKey}, deleting session.`);
                await this.SessionService.deleteSession(sessionKey, client_type);
                logger.info(`Session deleted successfully for sessionKey: ${sessionKey}`);
                return true;
            }
            else {
                logger.warn(`Session not found or expired for sessionKey: ${sessionKey}`);
                throw new NotFoundError(`해당 세션이 만료되었거나 존재하지 않습니다`);
            }
        } catch (err) {
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Login process failed", err as Error);
        }
    }

    // 소셜 회원 로그아웃
    public async logoutSocial(provider_user_id: string, provider_type: userType, client_type: SESSION_TYPE): Promise<boolean> {
        logger.info(`Starting logoutSocial process for provider_user_id: ${provider_user_id}, provider_type: ${provider_type}`);
        try {
            // 소셜 유저 조회
            logger.debug(`Finding social user by provider_user_id: ${provider_user_id} and provider_type: ${provider_type}`);
            const socialUser = await this.SocialUserService.findSocialUserByProviderID(provider_user_id, provider_type).catch(() => null);

            if (!socialUser) {
                logger.warn(`Social user not found for provider_user_id: ${provider_user_id} and provider_type: ${provider_type}`);
                throw new NotFoundError(`해당 소셜 유저가 없습니다.`);
            }
            // 로그인 타입 검증
            if (client_type !== SESSION_TYPE.WEB && client_type !== SESSION_TYPE.APP) {
                logger.warn(`Invalid login type: ${client_type}`);
                throw new ValidationError("Invalid login type");
            }
            logger.debug(`Refreshing token for social user ID: ${socialUser.id}`);
            const data = await this.KakaoClient.refresh_token(socialUser.refresh_token);
            logger.info(`Token refreshed successfully for social user ID: ${socialUser.id}`);
            const provider_user_id2 = await this.KakaoClient.logout(data.access_token)
            logger.info(`Social user logged out successfully from provider: ${provider_type}`);

            const sessionKey = `social_user:${socialUser.id}:${client_type}`;
            logger.debug(`Checking session for sessionKey: ${sessionKey}`);

            const exist_session = await this.SessionService.getSession(sessionKey, client_type);

            if (exist_session) {
                logger.info(`Session found for sessionKey: ${sessionKey}, deleting session.`);
                await this.SessionService.deleteSession(sessionKey, client_type);
                logger.info(`Session deleted successfully for sessionKey: ${sessionKey}`);
                return true;
            }
            else {
                logger.warn(`Session not found or expired for sessionKey: ${sessionKey}`);
                throw new NotFoundError(`해당 세션이 만료되었거나 존재하지 않습니다`);
            }
        } catch (err) {
            throw err instanceof NotFoundError || err instanceof ValidationError
                ? err
                : new ValidationError("Social login process failed", err as Error);
        }

    }
}

export default UserLogoutService;